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
    [Route("api/notes")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private const string ipLocationUrl = "http://ip-api.com/json/";
        private readonly IWebHostEnvironment _enviorment;
        private readonly IConfiguration _config;
        private readonly ILogger<NoteController> _logger;
        private readonly INoteRepository _noteRepo;
        private readonly IUserRepository _userRepo;
        private readonly ISiteMapRepository _siteRepo;


        public NoteController(
            IWebHostEnvironment environment, 
            IConfiguration config, 
            ILogger<NoteController> logger, 
            INoteRepository noteRepo, 
            IUserRepository userRepo, 
            ISiteMapRepository siteRepo)
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
        public IActionResult PostNote([FromBody] PostNoteView note, BoardWriteFormType formType)
        {
            _logger.LogInformation($"PostNote: {note.title} {formType} {DateTime.Now:yyyy/MM/dd HH:mm:ss}");
            note.postIp = HttpContext.Connection.RemoteIpAddress.ToString();

            if (XssCheck(note.content)) return StatusCode(403);
            note.content = note.content.Replace("&quot;", "");

            try
            {
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
                _logger.LogError($"error: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }
        #endregion

        #region [ Post Category ]
        [HttpPost("categories")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public IActionResult PostCategory([FromBody] CategoryViewModel categoryView)
        {
            _logger.LogInformation($"Category: {categoryView.category} SubCategory: {categoryView.subCategory} {DateTime.Now:yyyy/MM/dd HH:mm:ss}");

            var parameterModulationCheck = DecryptTokenInfo(
                HttpContext.RequestServices
                .GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>());

            var userInfo = _userRepo.GetUserByUserId(categoryView.userId);
            if (userInfo.role != parameterModulationCheck["Role"]) return StatusCode(403);

            try
            {
                var result = _noteRepo.PostCategory(categoryView.category, categoryView.subCategory);
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
        [HttpPost("ipLog")]
        public async Task<IActionResult> PostIpLog([FromBody] IpLogModel logmodel)
        {
            _logger.LogInformation($"ip: {logmodel.visitorIp}, id: {logmodel.blogId}");

            try
            {
                var ipInfo = GetIpLocation(logmodel.visitorIp).Result;
                ipInfo.id = logmodel.blogId;
                await _noteRepo.PostIpLog(ipInfo);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError($"error: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }

        private async Task<IpLocationInfo> GetIpLocation(string requestIp)
        {
            string requestUrl = ipLocationUrl + requestIp;

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await client.GetAsync(requestUrl);
            var stream = await response.Content.ReadAsStreamAsync();

            using var sr = new StreamReader(stream);
            var jsonResult = JObject.Parse(await sr.ReadToEndAsync());
            return jsonResult.ToObject<IpLocationInfo>();
        }
        #endregion

        #region [ Delete Note ]
        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public IActionResult DeleteNote(int id)
        {
            _logger.LogInformation($"DeleteNote: {id} {DateTime.Now:yyyy/MM/dd HH:mm:ss}");

            try
            {
                var result = _noteRepo.DeleteNote(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"error: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }
        #endregion

        #region [ Get Note Info ]
        [HttpGet("all")]
        public async Task<IActionResult> GetNoteAll(int userId)
        {
            _logger.LogInformation($"GetNoteAll: {userId} {DateTime.Now:yyyy/MM/dd HH:mm:ss}");

            try
            {
                var results = await _noteRepo.GetNoteAll(userId);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"error: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary() 
        {
            _logger.LogInformation($"summary: {DateTime.Now:yyyy/MM/dd HH:mm:ss}");

            try{
                var results = await _noteRepo.GetSummary();
                return Ok(results);
            }
            catch (Exception ex){
                _logger.LogError($"error: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("detail")]
        public async Task<IActionResult> GetNoteById(int id)
        {
            _logger.LogInformation($"GetNoteById: {id} {DateTime.Now:yyyy/MM/dd HH:mm:ss}");

            try
            {
                int userId = 0;
                if (!string.IsNullOrEmpty(HttpContext.Request.Cookies["UserLoginCookie"]))
                {
                    var parameterModulationCheck = DecryptTokenInfo(HttpContext.RequestServices.GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>());
                    userId = Convert.ToInt32(parameterModulationCheck["userId"]);
                }
                string ip = HttpContext.Connection.RemoteIpAddress.ToString();
                var note = await _noteRepo.GetNoteById(id, userId, ip);
                return Ok(note);
            }
            catch (Exception ex)
            {
                _logger.LogError($"error: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }
        #endregion

        #region [ Get Sidebar Info ]
        [HttpGet("search")]
        public async Task<IActionResult> GetNoteBySearch(string query)
        {
            _logger.LogInformation($"GetNoteBySearch: {query} {DateTime.Now:yyyy/MM/dd HH:mm:ss}");

            try
            {
                var notes = await _noteRepo.GetNoteBySearch(query);
                return Ok(notes.ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError($"error: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("category")]
        public async Task<IActionResult> GetNoteByCategory(int id, string category, string subCategory)
        {
            _logger.LogInformation($"GetNoteByCategory: id: {id}, {category}|{subCategory} {DateTime.Now:yyyy/MM/dd HH:mm:ss}");

            try
            {
                var notes = await _noteRepo.GetNoteByCategory(id, category, subCategory);
                return Ok(notes.ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError($"error: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("categories")]
        [Produces("application/json")]
        public async Task<IActionResult> GetCategoryList()
        {
            _logger.LogInformation($"getCategoryList {DateTime.Now:yyyy/MM/dd HH:mm:ss}");

            try
            {
                var categoryList = await _noteRepo.GetNoteCategoryList();
                return Ok(categoryList);
            }
            catch (Exception ex)
            {
                _logger.LogError($"error: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("sidebar/categories")]
        public async Task<IActionResult> GetSidebarCategoryList()
        {
            _logger.LogInformation($"getSidebarCategoryList {DateTime.Now:yyyy/MM/dd HH:mm:ss}");

            try
            {
                var categoryList = await _noteRepo.GetSidebarCategoryList();
                return Ok(categoryList);
            }
            catch (Exception ex)
            {
                _logger.LogError($"error: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }
        #endregion

        #region [ SaveImage ]
        [HttpPost("saveImage")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public async Task<string> SaveImage(IFormFile file)
        {
            try
            {
                var extension = Path.GetExtension(file.FileName);
                if (!fileExtensionType.Contains(extension))
                    return "Err.. Check file Ext Type";

                if (file.Length > 0)
                {
                    var fileName = await SaveImageFile(Path.Combine(_enviorment.WebRootPath, "files"), file);
                    return fileName;
                }
                return "Err.. File is empty";
            }
            catch (Exception ex)
            {
                return $"Err.. Check file Type: {ex.Message}";
            }
        }

        private async Task<string> SaveImageFile(string uploadDir, IFormFile file)
        {
            var fileName = CommonLibrary.FileUtility.GetFileNameWithNumbering(uploadDir, Path.GetFileName(ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName));

            var extractedFileName = fileName.Substring(fileName.LastIndexOf("/files/") + "/files/".Length);
            var fileFullPath = Path.Combine(uploadDir, fileName);

            await using (var fileStream = new FileStream(fileFullPath, FileMode.OpenOrCreate))
            {
                await file.CopyToAsync(fileStream);
            }
            return extractedFileName;
        }
        #endregion
        #region [ Read Count Info ]
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
        private Boolean XssCheck(string content)
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
