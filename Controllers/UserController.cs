using System;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using next_core_blog.CommonLibrary;
using next_core_blog.Model.User;
using next_core_blog.Repository.Users;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;

namespace next_core_blog.Controllers
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
                model.name = model.name.Trim();
                model.password = new Security().EncryptPassword(model.password);

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
                    if (LoginMoreThanFiveTimesWithin10min(model.email))
                        return StatusCode(403);

                    string password = new Security().EncryptPassword(model.password);
                    if (_userRepo.IsCorrectUser(model.email, password))
                    {
                        RegisterViewModel userInfo = await _userRepo.GetUserByEmail(model.email);
                        createCookie(userInfo);
                        return Ok(userInfo);
                    }
                    else
                    {
                        _userRepo.TryLogin(model.email);
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
                            new Claim("name", userInfo.name),
                            new Claim("Email", userInfo.email),
                            new Claim("Role", userInfo.role)
                        };
            var claimsIdentity = new ClaimsIdentity(
                claims, CookieAuthenticationDefaults.AuthenticationScheme);
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
            var opt = HttpContext.RequestServices.GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>();
            var cookie = opt.CurrentValue.CookieManager.GetRequestCookie(HttpContext, "UserLoginCookie");

            if (!string.IsNullOrEmpty(cookie))
            {
                var dataProtector = opt.CurrentValue.DataProtectionProvider.CreateProtector("Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationMiddleware", CookieAuthenticationDefaults.AuthenticationScheme, "v2");
                var ticketDataFormat = new TicketDataFormat(dataProtector);
                var ticket = ticketDataFormat.Unprotect(cookie);

                if (ticket?.Principal?.Claims != null)
                {
                    Dictionary<string, string> tokenInfo = new Dictionary<string, string>();
                    foreach (var claim in ticket.Principal.Claims)
                    {
                        tokenInfo.Add(claim.Type, claim.Value);
                    }
                    return await _userRepo.GetUserByEmail(tokenInfo["Email"]);
                }
            }
            _logger.LogInformation("meAPIAsync:" + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss") + "cookie not exist");

            return null;
        }
        #endregion
    }
}
