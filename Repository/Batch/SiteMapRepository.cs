using System;
using System.IO;
using System.Linq;
using System.Xml;
using Dapper;
using Microsoft.Extensions.Logging;
using next_core_blog.Model.Batch;
using next_core_blog.Context;

namespace next_core_blog.Repository.Batch
{
    public class SiteMapRepository : ISiteMapRepository
    {
        private readonly DapperContext _context;
        private ILogger<SiteMapRepository> _logger;

        public SiteMapRepository(DapperContext context, ILogger<SiteMapRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public void SitemapXmlGenerator()
        {
            _logger.LogInformation("GetJObject Start " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));
            string sql = @" SELECT noteId, PostDate, ModifyDate
                            FROM note
                            WHERE isPost = 'Y'
                            ORDER BY noteId";

            using (var con = _context.CreateConnection())
            {
                var noteList = con.Query<NoteInfo>(sql).ToArray();
                XmlDocument xmlDoc = new XmlDocument();
                XmlNode root = SetRootTag(xmlDoc);

                SetDefaultUrl(xmlDoc, noteList, root);
                for (int i = 0; i < noteList.Length; i++)
                {
                    if (noteList[i].modifyDate == null)
                        noteList[i].modifyDate = noteList[i].postDate;
                    SetBlogUrl(noteList, xmlDoc, root, i);
                    SetWWWBlogUrl(noteList, xmlDoc, root, i);
                }
                SaveXml(xmlDoc);
            }
        }

        private static XmlNode SetRootTag(XmlDocument xmlDoc)
        {
            XmlNode root = xmlDoc.CreateElement("urlset");
            XmlAttribute attr = xmlDoc.CreateAttribute("xmlns");
            attr.Value = "http://www.sitemaps.org/schemas/sitemap/0.9";
            root.Attributes.Append(attr);
            xmlDoc.AppendChild(root);
            return root;
        }
        private void SetBlogUrl(NoteInfo[] count, XmlDocument xmlDoc, XmlNode root, int idx)
        {
            try
            {
                XmlNode url = xmlDoc.CreateElement("url");
                XmlNode loc = xmlDoc.CreateElement("loc");
                loc.InnerText = "https://owl-dev.me/blog/" + count[idx].noteId;
                url.AppendChild(loc);

                XmlNode lastmod = xmlDoc.CreateElement("lastmod");
                lastmod.InnerText = count[idx].modifyDate.Split(" ")[0].ToString();
                url.AppendChild(lastmod);
                root.AppendChild(url);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

        }
        private void SetWWWBlogUrl(NoteInfo[] count, XmlDocument xmlDoc, XmlNode root, int idx)
        {
            try
            {
                XmlNode url = xmlDoc.CreateElement("url");
                XmlNode loc = xmlDoc.CreateElement("loc");
                loc.InnerText = "https://www.owl-dev.me/blog/" + count[idx].noteId;
                url.AppendChild(loc);

                XmlNode lastmod = xmlDoc.CreateElement("lastmod");
                lastmod.InnerText = count[idx].modifyDate.Split(" ")[0].ToString();
                url.AppendChild(lastmod);
                root.AppendChild(url);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }
        private static void SetDefaultUrl(XmlDocument xmlDoc, NoteInfo[] count, XmlNode root)
        {
            XmlNode defaultUrl = xmlDoc.CreateElement("url");
            XmlNode defaultLoc = xmlDoc.CreateElement("loc");
            defaultLoc.InnerText = "https://owl-dev.me";
            defaultUrl.AppendChild(defaultLoc);

            XmlNode defaultLastmod = xmlDoc.CreateElement("lastmod");
            defaultLastmod.InnerText = count[0].modifyDate.Split(" ")[0].ToString();
            defaultUrl.AppendChild(defaultLastmod);
            root.AppendChild(defaultUrl);
        }
        private static void SaveXml(XmlDocument xmlDoc)
        {
            var curDirectory = Directory.GetCurrentDirectory();
            var Path = "/client-app/public/";
            var fileName = "sitemap.xml";
            xmlDoc.Save(curDirectory + Path + fileName);
        }
    }
}