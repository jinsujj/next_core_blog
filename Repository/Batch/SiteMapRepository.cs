using System;
using System.IO;
using System.Linq;
using System.Xml;
using Dapper;
using Microsoft.Extensions.Logging;
using next_core_blog.Model.Batch;
using Next_Core_Blog.Context;

namespace Next_core_blog.Repository.Batch
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
                var noteList = con.Query<noteInfo>(sql).ToArray();
                XmlDocument xmlDoc = new XmlDocument();
                XmlNode root = SetRootTag(xmlDoc);

                SetDefaultUrl(xmlDoc, noteList, root);
                for (int i = 0; i < noteList.Length; i++)
                {
                    if (noteList[i].ModifyDate.Length == 0)
                        noteList[i].ModifyDate = noteList[i].PostDate;
                    SetBlogUrl(noteList, xmlDoc, root, i);
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
        private static void SetBlogUrl(noteInfo[] count, XmlDocument xmlDoc, XmlNode root, int idx)
        {
            XmlNode url = xmlDoc.CreateElement("url");
            XmlNode loc = xmlDoc.CreateElement("loc");
            loc.InnerText = "https://owl-dev.me/blog/" + count[idx].noteId;
            url.AppendChild(loc);

            XmlNode lastmod = xmlDoc.CreateElement("lastmod");
            lastmod.InnerText = count[idx].ModifyDate;
            url.AppendChild(lastmod);
            root.AppendChild(url);
        }
        private static void SetDefaultUrl(XmlDocument xmlDoc, noteInfo[] count, XmlNode root)
        {
            XmlNode defaultUrl = xmlDoc.CreateElement("url");
            XmlNode defaultLoc = xmlDoc.CreateElement("loc");
            defaultLoc.InnerText = "https://owl-dev.me";
            defaultUrl.AppendChild(defaultLoc);

            XmlNode defaultLastmod = xmlDoc.CreateElement("lastmod");
            defaultLastmod.InnerText = count[0].ModifyDate;
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