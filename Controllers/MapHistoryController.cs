using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using next_core_blog.Repository.Map;

namespace next_core_blog.Controllers
{
    [Route("api/MapHistory")]
    public class IpHistoryController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<IpHistoryController> _logger;
        private readonly IMapHistoryRepository _mapRepo;

        public IpHistoryController(IConfiguration config, ILogger<IpHistoryController> logger, IMapHistoryRepository mapRepo)
        {
            _config = config;
            _logger = logger;
            _mapRepo = mapRepo;
        }

        [HttpGet("logInfoAll")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetLogInfoAll()
        {
            try
            {
                _logger.LogInformation("getLogInfoAll: " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

                var mapHistory = await _mapRepo.GetLogHistoryAll();
                return Ok(mapHistory);
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("logInfoDaily")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetLogInfoDaily()
        {
            try
            {
                _logger.LogInformation("getLogInfoDaily: " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

                var mapHistory = await _mapRepo.GetLogHistoryDaily();
                return Ok(mapHistory);
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("dailyIpCoordinate")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetDailyIpCoordinate()
        {
            _logger.LogInformation("getDailyIpCoordinate: " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try
            {
                var mapHistory = await _mapRepo.GetIpCooldinates();
                return Ok(mapHistory);
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetNoteTitleByIp")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetNoteTitleByIp()
        {
            _logger.LogInformation("GetNoteTitleByIp: " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try
            {
                var mapHistory = await _mapRepo.GetNoteTitleByIp();
                return Ok(mapHistory);
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }
    }
}