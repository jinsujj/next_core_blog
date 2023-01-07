using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using next_core_blog.Model.BlogNote;
using next_core_blog.Repository.Batch;
using next_core_blog.Model.User;
using next_core_blog.Repository.BlogNote;
using next_core_blog.Repository.Users;

namespace next_core_blog.Controllers
{
    [Route("api/Note")]
    [ApiController]
    public class noteController : ControllerBase
    {
        private const string ipLocationUrl = "http://ip-api.com/json/";
        private IWebHostEnvironment _enviorment;
        private readonly IConfiguration _config;
        private readonly ILogger<noteController> _logger;
        private readonly INoteRepository _noteRepo;
        private readonly IUserRepository _userRepo;
        private readonly ISiteMapRepository _siteRepo;


        public noteController(IWebHostEnvironment environment, IConfiguration config, ILogger<noteController> logger, INoteRepository noteRepo, IUserRepository userRepo, ISiteMapRepository siteRepo)
        {
            _enviorment = environment;
            _config = config;
            _logger = logger;
            _noteRepo = noteRepo;
            _userRepo = userRepo;
            _siteRepo = siteRepo;
        }

        #region [ Post Note ]
        [HttpPost]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public IActionResult PostNote(PostNoteView note, BoardWriteFormType formType)
        {
            _logger.LogInformation("PostNote: " + note.title + " " + formType + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));
            note.postIp = HttpContext.Connection.RemoteIpAddress.ToString();
            try
            {
                if (XSS_Check(note.content)) return StatusCode(403);
                note.content.Replace("&quot", "");

                if (formType == BoardWriteFormType.modify)
                {
                    var parameterModulationCheck = DecryptTokenInfo(
                        HttpContext.RequestServices
                        .GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>());

                    if (note.userId != Convert.ToInt32(parameterModulationCheck["userId"]))
                        return StatusCode(403);
                }
                // sitemap.xml update
                _siteRepo.SitemapXmlGenerator();
                return Ok(_noteRepo.PostNote(note, formType));
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }
        #endregion

        #region [ Post Category ]
        [HttpPost("PostCategory")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public IActionResult PostCategory([FromBody] CategoryViewModel categoryView)
        {
            _logger.LogInformation("Category: " + categoryView.category + " SubCateghory:  " + categoryView.subCategory + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            var parameterModulationCheck = DecryptTokenInfo(
                HttpContext.RequestServices
                .GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>());

            RegisterViewModel userInfo = _userRepo.GetUserByUserId(categoryView.userId);
            if (userInfo.role != parameterModulationCheck["Role"]) return StatusCode(403);

            try
            {
                var result = _noteRepo.PostCategory(
                    categoryView.category, categoryView.subCategory);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }
        #endregion

        #region [ Save Log ]
        [HttpPost("postIpLog")]
        public async Task<IActionResult> PostIpLog([FromBody] IpLogModel logmodel)
        {
            try
            {
                _logger.LogInformation("ip: " + logmodel.ip + " ,id: " + logmodel.id);

                IpLocationInfo ipInfo = GetIpLocation(logmodel.ip).Result;
                ipInfo.id = logmodel.id;
                await _noteRepo.PostIpLog(ipInfo);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        private async Task<IpLocationInfo> GetIpLocation(string requestIp)
        {
            string requestURL = ipLocationUrl + requestIp;

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage response = await client.GetAsync(requestURL);
                Stream stream = response.Content.ReadAsStream();

                using (StreamReader sr = new StreamReader(stream))
                {
                    JObject jsonResult = JObject.Parse(sr.ReadToEnd());
                    return jsonResult.ToObject<IpLocationInfo>();
                }
            }
        }
        #endregion

        #region [ Delete Note ]
        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public IActionResult DeleteNote(int id)
        {
            _logger.LogInformation("DeleteNote: " + id + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try
            {
                var result = _noteRepo.DeleteNote(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }
        #endregion

        #region [ Get Note Info ]
        [HttpGet("getNoteAll")]
        public async Task<IActionResult> GetNoteAll(int userId)
        {
            _logger.LogInformation("GetNoteAll: " + userId + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try
            {
                var results = await _noteRepo.GetNoteAll(userId);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("NoteById")]
        public async Task<IActionResult> GetNoteById(int id)
        {
            _logger.LogInformation("GetNoteById: " + id + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));
            int userId = 0;
            if (!String.IsNullOrEmpty(HttpContext.Request.Cookies["UserLoginCookie"]))
            {
                var parameterModulationCheck = DecryptTokenInfo(HttpContext.RequestServices.GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>());
                userId = Convert.ToInt32(parameterModulationCheck["userId"]);
            }

            try
            {
                string ip = HttpContext.Connection.RemoteIpAddress.ToString();
                var note = await _noteRepo.GetNoteById(id, userId, ip);
                return Ok(note);
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }
        #endregion

        #region [ Get Sidebar Info ]
        [HttpGet("search")]
        public async Task<IActionResult> GetNoteBySearch(string query)
        {
            _logger.LogInformation("GetNoteBySearch: " + query + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try
            {
                var notes = await _noteRepo.GetNoteBySearch(query);
                return Ok(notes.ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("category")]
        public async Task<IActionResult> GetNoteByCategory(int id, string category, string subCategory)
        {
            _logger.LogInformation("GetNoteByCategory: " + "id: " + id + " ," + category + "|" + subCategory + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try
            {
                var notes = await _noteRepo.GetNoteByCategory(id, category, subCategory);
                return Ok(notes.ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("getCategoryList")]
        [Produces("application/json")]
        public async Task<IActionResult> GetCategoryList()
        {
            _logger.LogInformation("getCategoryList" + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));
            try
            {
                var categoryList = await _noteRepo.GetNoteCategoryList();
                return Ok(categoryList);
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("getSidebarCategoryList")]
        public async Task<IActionResult> GetSidebarCategoryList()
        {
            _logger.LogInformation("getSidebarCategoryList" + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));
            try
            {
                var categoryList = await _noteRepo.GetSidebarCategoryList();
                return Ok(categoryList);
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }
        #endregion

        #region [ SaveImage ]
        [HttpPost("saveImage")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public async Task<string> SaveImage(IFormFile file)
        {
            string fileName = "";
            try
            {
                if (fileExtensionType.Where(t => t == Path.GetExtension(file.FileName)).FirstOrDefault().Length < 1)
                    return "Err.. Check file Ext Type ";

                if ((file != null) && (file.Length > 0))
                    fileName = await SaveImageFile(Path.Combine(_enviorment.WebRootPath, "files"), file);

                return fileName;
            }
            catch (Exception ex)
            {
                return "Err.. Check file Type " + ex.Message;
            }
        }

        private async Task<String> SaveImageFile(string uploadDir, IFormFile file)
        {
            string fileFullPath = CommonLibrary.FileUtility.GetFileNameWithNumbering(uploadDir,
                                Path.GetFileName(ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.ToString()));

            string fileName = fileFullPath.Split("files")[1].Substring(1);
            using (FileStream fileStream = new FileStream(fileFullPath, FileMode.OpenOrCreate))
            {
                await file.CopyToAsync(fileStream);
            }
            return fileName;
        }
        #endregion

        #region [ Read Count Info ]
        [HttpGet("noteCountAll")]
        public IActionResult GetCountAll()
        {
            try
            {
                return Ok(_noteRepo.GetCountAll());
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("totalReadCount")]
        public async Task<IActionResult> GetTotalReadCount()
        {
            try
            {
                return Ok(await _noteRepo.GetTotalReadCount());
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("todayReadCount")]
        public async Task<IActionResult> GetTodayReadCount()
        {
            try
            {
                return Ok(await _noteRepo.GetTodayReadCount());
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }
        #endregion

        #region [ Security Check ]
        private Boolean XSS_Check(string content)
        {
            int openTagIndex = -1, closeTagIndex = -1, index = 0;
            var arrayValue = content.ToArray();
            foreach (var t in arrayValue)
            {
                if (t == '<' && openTagIndex == -1)
                    openTagIndex = index;
                else if (t == '>' && closeTagIndex == -1)
                    closeTagIndex = index;

                if (openTagIndex != -1 && closeTagIndex != -1)
                {
                    var buff = content.Substring(openTagIndex, (closeTagIndex - openTagIndex + 1)).ToLower();

                    // Except
                    if (buff.Contains("typescript") ||
                        buff.Contains("language-javascrip"))
                        continue;

                    else if (buff.Contains("script"))
                        return true;

                    openTagIndex = -1;
                    closeTagIndex = -1;
                }
                index++;
            }
            return false;
        }

        private Dictionary<string, string> DecryptTokenInfo(IOptionsMonitor<CookieAuthenticationOptions> opt)
        {
            Dictionary<string, string> tokenInto = new Dictionary<string, string>();

            var cookie = opt.CurrentValue.CookieManager.GetRequestCookie(
                HttpContext, "UserLoginCookie");

            var dataProtector = opt.CurrentValue.DataProtectionProvider.CreateProtector(
                "Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationMiddleware", CookieAuthenticationDefaults.AuthenticationScheme, "v2");

            var ticketDataFormat = new TicketDataFormat(dataProtector);
            var ticket = ticketDataFormat.Unprotect(cookie);
            foreach (var claim in ticket.Principal.Claims)
            {
                tokenInto.Add(claim.Type, claim.Value);
            }
            return tokenInto;
        }
        #endregion

        [HttpPost("sitemapGenerator")]
        public void SitemapXmlGenerator()
        {
            _logger.LogInformation("SitemapXmlGenerator" + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));
            _siteRepo.SitemapXmlGenerator();
        }

        public IEnumerable<string> fileExtensionType = new List<string>{
            ".jpg",".jpeg",".png"
        };
    }
}