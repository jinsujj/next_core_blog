using System;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Next_Core_Blog.CommonLibrary;
using Next_Core_Blog.Model.User;
using Next_Core_Blog.Repository.Users;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;

namespace Next_Core_Blog.Controllers
{
    [Route("api/User")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<UserController> _logger;
        private readonly IUserRepository _userRepo;

        public UserController(IConfiguration config, ILogger<UserController> logger, IUserRepository userRepo)
        {
            _config = config;
            _logger = logger;
            _userRepo = userRepo;
        }

        #region [ Register ]
        [HttpPost]
        public IActionResult Register(RegisterViewModel model)
        {
            _logger.LogInformation("Register:" + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));
            if (ModelState.IsValid)
            {
                model.Name = model.Name.Trim();
                model.Password = new Security().EncryptPassword(model.Password);

                bool result = _userRepo.AddUser(model);
                if (result)
                    return Ok(true);
                else
                    return StatusCode(401);
            }

            return BadRequest();
        }
        #endregion

        #region [ Login ]
        [HttpPost("Login")]
        [Produces("application/json")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginViewModel model)
        {
            _logger.LogInformation("Login:" + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));
            try
            {
                if (ModelState.IsValid)
                {
                    if (LoginMoreThanFiveTimesWithin10min(model.Email))
                        return StatusCode(403);

                    if (_userRepo.IsCorrectUser(model.Email, new Security().EncryptPassword(model.Password)))
                    {
                        RegisterViewModel userInfo = await _userRepo.GetUserByEmail(model.Email);
                        createCookie(userInfo);
                        return Ok(userInfo);
                    }
                    else
                    {
                        _userRepo.TryLogin(model.Email);
                        return StatusCode(401);
                    }
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        private bool LoginMoreThanFiveTimesWithin10min(string Email)
        {
            // is Registed User?
            if (_userRepo.IsRegistedUser(Email))
            {
                // attempt more than 5times and within 10 minutes
                if (_userRepo.IsFiveOverCount(Email) && _userRepo.IsLastLoginWithinTenMinute(Email))
                {
                    return true;
                }
            }
            return false;
        }
        private void createCookie(RegisterViewModel userInfo)
        {
            var claims = new List<Claim>()
                        {
                            new Claim("userId", userInfo.userId.ToString()),
                            new Claim("name", userInfo.Name),
                            new Claim("Email", userInfo.Email),
                            new Claim("Role", userInfo.Role)
                        };
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity)).Wait();
        }
        #endregion

        #region [ Logout ]
        [HttpGet("Logout")]
        [Produces("application/json")]
        public IActionResult Logout()
        {
            try
            {
                HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme).Wait();
                return Ok("true");
            }
            catch
            {
                return StatusCode(500);
            }
        }
        #endregion

        #region [ Decode Cookie ]
        [HttpGet("meAPI")]
        [Produces("application/json")]
        public async Task<RegisterViewModel> meAPIAsync()
        {
            // Get the encrypted cookie value
            var opt = HttpContext.RequestServices.GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>();
            var cookie = opt.CurrentValue.CookieManager.GetRequestCookie(HttpContext, "UserLoginCookie");
            Dictionary<string, string> tokenInfo = new Dictionary<string, string>();
            _logger.LogInformation("[[ Cookie ]]");
            _logger.LogInformation(cookie);
            try
            {
                if (!string.IsNullOrEmpty(cookie))
                {
                    var dataProtector = opt.CurrentValue.DataProtectionProvider.CreateProtector("Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationMiddleware", CookieAuthenticationDefaults.AuthenticationScheme, "v2");
                    var ticketDataFormat = new TicketDataFormat(dataProtector);
                    var ticket = ticketDataFormat.Unprotect(cookie);
                    foreach (var claim in ticket.Principal.Claims)
                    {
                        tokenInfo.Add(claim.Type, claim.Value);
                    }
                    return await _userRepo.GetUserByEmail(tokenInfo["Email"]); ;
                }
            }
            catch(Exception e){
                _logger.LogError("[[ ERROR ]]");
                _logger.LogError(e.Message);
            }


            return null;
        }
        #endregion
    }
}