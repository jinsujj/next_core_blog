using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Next_core_blog.Repository.Map;

namespace Next_core_blog.Controllers
{
    [Route("api/MapHistory")]
    public class IpHistoryController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<IpHistoryController> _logger;
        private readonly IMapHistoryRepository _mapRepo;

        public IpHistoryController(IConfiguration config, ILogger<IpHistoryController> logger, IMapHistoryRepository mapRepo){
            _config = config;
            _logger = logger;
            _mapRepo = mapRepo;
        }

        [HttpGet("logInfoAll")]
        public async Task<IActionResult> getLogInfoAll(){
            try {
                _logger.LogInformation("getLogInfoAll: "+DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

                var mapHistory = await _mapRepo.GetLogHistoryAll();
                return Ok(mapHistory);
            }
            catch(Exception ex) {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("logInfoDaily")]
        public async Task<IActionResult> getLogInfoDaily(){
            try {
                _logger.LogInformation("getLogInfoDaily: "+DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

                var mapHistory = await _mapRepo.GetLogHistoryDaily();
                return Ok(mapHistory);
            }
            catch(Exception ex) {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("dailyIpCoordinate")]
        public async Task<IActionResult> getDailyIpCoordinate(){
            _logger.LogInformation("getDailyIpCoordinate: "+DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try {
                var mapHistory = await _mapRepo.GetMapCooldinates();
                return Ok(mapHistory);
            }
            catch(Exception ex) {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }
    }
}