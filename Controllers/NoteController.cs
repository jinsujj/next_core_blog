using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        private readonly IConfiguration _config;
        private readonly ILogger<NoteController> _logger;

        private readonly INoteRepository _noteRepo;


        public NoteController(IConfiguration config, ILogger<NoteController> logger, INoteRepository noteRepo)
        {
            _config = config;
            _logger = logger;
            _noteRepo = noteRepo;
        }

        [HttpPost]
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

        [HttpDelete("{id}")]
        public IActionResult DeleteNote(int id){
            _logger.LogInformation("DeleteNote: " + id + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try{
                var result = _noteRepo.DeleteNode(id);
                return Ok(result);
            }
            catch(Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("getNoteAll")]
        public async Task<IActionResult> GetNoteAll()
        {
            _logger.LogInformation("GetNoteAll: " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try{
                var results = await _noteRepo.GetNoteAll();
                return Ok(results);
            }
            catch(Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("category")]
        public async Task<IActionResult> GetNoteByCategory(string category, string subCategory)
        {
            _logger.LogInformation("GetNoteByCategory: " + category+ "|" + subCategory + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try{
                var notes = await _noteRepo.GetNoteByCategory(category, subCategory);
                return Ok(notes.ToList());
            }
            catch(Exception ex)
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
            catch(Exception ex)
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
            catch(Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("noteCountAll")]
        public IActionResult GetCountAll()
        {
            _logger.LogInformation("GetCountAll: " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try{
                var result = _noteRepo.GetCountAll();
                return Ok(result);
            }
            catch(Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }
    }
}