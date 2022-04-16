using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Next_Core_Blog.CommonLibrary;
using Next_Core_Blog.Model.BlogNote;
using Next_Core_Blog.Repository.BlogNote;

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


        public NoteController(IWebHostEnvironment environment, IConfiguration config, ILogger<NoteController> logger, INoteRepository noteRepo)
        {
            _enviorment = environment;
            _config = config;
            _logger = logger;
            _noteRepo = noteRepo;
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public IActionResult PostNote(Note note, BoardWriteFormType formType)
        {
            _logger.LogInformation("PostNote: " + note.Title + " " + formType + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try
            {
                var result = 0;

                note.Password = new Security().EncryptPassword(note.Password);

                if (formType == BoardWriteFormType.create)
                {
                    result = _noteRepo.PostNote(note, BoardWriteFormType.create);
                }
                else if (formType == BoardWriteFormType.modify)
                {
                    result = _noteRepo.PostNote(note, BoardWriteFormType.modify);
                }

                return CreatedAtRoute("NodeById", new { id = result }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("PostCategory")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public IActionResult PostCategory([FromBody] CategoryViewModel categoryView)
        {
            _logger.LogInformation("Category: " + categoryView.category + " SubCateghory:  " + categoryView.subCategory + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

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

        [HttpGet("{id}", Name = "NodeById")]
        public IActionResult GetNoteById(int id)
        {
            _logger.LogInformation("GetNoteBySearch: " + id + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try
            {
                var note = _noteRepo.GetNoteById(id);
                return Ok(note);
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

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

        [HttpGet("getNoteAll")]
        public async Task<IActionResult> GetNoteAll()
        {
            _logger.LogInformation("GetNoteAll: " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try
            {
                var results = await _noteRepo.GetNoteAll();
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("category")]
        public async Task<IActionResult> GetNoteByCategory(string category, string subCategory)
        {
            _logger.LogInformation("GetNoteByCategory: " + category + "|" + subCategory + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try
            {
                var notes = await _noteRepo.GetNoteByCategory(category, subCategory);
                return Ok(notes.ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

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
            catch(Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("saveImage")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public async Task<string> saveImage(IFormFile file)
        {
            try
            {
                // file Extension Check
                if(extType.Where(t => t == Path.GetExtension(file.FileName)).FirstOrDefault().Length <1){
                    return "Err.. Check file Type";
                }

                string fileName = string.Empty;
                string fileFullPath = string.Empty;
                var uploadDir = Path.Combine(_enviorment.WebRootPath, "files");

                if ((file != null) && (file.Length > 0))
                {
                    fileFullPath = CommonLibrary.FileUtility.GetFileNameWithNumbering(uploadDir,
                                Path.GetFileName(ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.ToString()));

                    fileName = fileFullPath.Split("files\\")[1].ToString();
                    using (FileStream fileStream = new FileStream(fileFullPath, FileMode.OpenOrCreate))
                    {
                        await file.CopyToAsync(fileStream);
                    }
                }
                return fileName;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return "Err.. Check file Type";
            }
        }


        [HttpGet("noteCountAll")]
        public IActionResult GetCountAll()
        {
            _logger.LogInformation("GetCountAll: " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try
            {
                var result = _noteRepo.GetCountAll();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        public IEnumerable<string> extType = new List<string>{
            ".jpg",".jpeg",".png"
        };
    }
}