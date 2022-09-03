using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Next_Core_Blog.CommonLibrary;
using Next_Core_Blog.Model.BlogNote;
using Next_Core_Blog.Model.User;
using Next_Core_Blog.Repository.BlogNote;
using Next_Core_Blog.Repository.Users;

namespace Next_Core_Blog.Controllers
{
    [Route("api/Note")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private IWebHostEnvironment _enviorment;
        private readonly IConfiguration _config;
        private readonly ILogger<NoteController> _logger;
        private readonly INoteRepository _noteRepo;
        private readonly IUserRepository _userRepo;


        public NoteController(IWebHostEnvironment environment, IConfiguration config, ILogger<NoteController> logger, INoteRepository noteRepo, IUserRepository userRepo)
        {
            _enviorment = environment;
            _config = config;
            _logger = logger;
            _noteRepo = noteRepo;
            _userRepo = userRepo;
        }

        #region [ Post Note ]
        [HttpPost]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public IActionResult PostNote(PostNoteView note, BoardWriteFormType formType)
        {
            _logger.LogInformation("PostNote: " + note.title + " " + formType + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));
            note.postIp = HttpContext.Connection.RemoteIpAddress.ToString();
            try {
                if (XSS_Check(note.content)) return StatusCode(403);

                if (formType == BoardWriteFormType.modify)
                {
                    var parameterModulationCheck = DecryptTokenInfo(HttpContext.RequestServices.GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>());
                    if (note.userId != Convert.ToInt32(parameterModulationCheck["userId"]))
                        return StatusCode(403);
                }

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

            var parameterModulationCheck = DecryptTokenInfo(HttpContext.RequestServices.GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>());
            RegisterViewModel userInfo = _userRepo.GetUserByUserId(categoryView.userId);
            if (userInfo.Role != parameterModulationCheck["Role"]) return StatusCode(403);

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
        [HttpPost("postIpLog")]
        public async Task<IActionResult> postIpLog([FromBody] IpLogModel logmodel)
        {
            try
            {
                _logger.LogInformation("ip: "+logmodel.ip+" ,id: "+logmodel.id);
                await _noteRepo.postIpLog(logmodel);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
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
                var result = _noteRepo.DeleteNode(id);
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
        public async Task<IActionResult> getCategoryList()
        {
            _logger.LogInformation("getCategoryList" + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));
            try
            {
                var categoryList = await _noteRepo.getNoteCategoryList();
                return Ok(categoryList);
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("getSidebarCategoryList")]
        public async Task<IActionResult> getSidebarCategoryList()
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
        public async Task<string> saveImage(IFormFile file)
        {
            string fileName = "";
            try
            {
                if (fileExtensionType.Where(t => t == Path.GetExtension(file.FileName)).FirstOrDefault().Length < 1)
                    return "Err.. Check file Ext Type ";

                if ((file != null) && (file.Length > 0))
                    fileName = await saveImageFile(Path.Combine(_enviorment.WebRootPath, "files"), file);

                return fileName;
            }
            catch (Exception ex)
            {
                return "Err.. Check file Type";
            }
        }

        private async Task<String> saveImageFile(string uploadDir, IFormFile file)
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
        public async Task<IActionResult> getTotalReadCount()
        {
            try
            {
                return Ok(await _noteRepo.getTotalReadCount());
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("todayReadCount")]
        public async Task<IActionResult> getTodayReadCount()
        {
            try
            {
                return Ok(await _noteRepo.getTodayReadCount());
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
            int openTagIndex = -1, closeTagIndex = -1, index =0;
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
                    if (buff.Contains("typescript")) continue;
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

            var cookie = opt.CurrentValue.CookieManager.GetRequestCookie(HttpContext, "UserLoginCookie");
            var dataProtector = opt.CurrentValue.DataProtectionProvider.CreateProtector("Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationMiddleware", CookieAuthenticationDefaults.AuthenticationScheme, "v2");
            var ticketDataFormat = new TicketDataFormat(dataProtector);
            var ticket = ticketDataFormat.Unprotect(cookie);
            foreach (var claim in ticket.Principal.Claims)
            {
                tokenInto.Add(claim.Type, claim.Value);
            }
            return tokenInto;
        }
        #endregion

        public IEnumerable<string> fileExtensionType = new List<string>{
            ".jpg",".jpeg",".png"
        };
    }
}