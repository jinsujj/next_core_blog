using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Next_Core_Blog.CommonLibrary;
using Next_Core_Blog.Model.User;
using Next_Core_Blog.Repository.Users;

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


        [HttpPost]
        public IActionResult Register(RegisterViewModel model)
        {
            _logger.LogInformation("Register:" + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            if (ModelState.IsValid)
            {
                _userRepo.AddUser(model);
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }


        [HttpPost("Login")]
        [Produces("application/json")]
        public IActionResult Login([FromBody] LoginViewModel model)
        {
            _logger.LogInformation("Login:" + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));

            try
            {
                if (ModelState.IsValid)
                {
                    if (isLoginFailed(model.Email))
                    {
                         return Ok(false);
                    }

                    // if (_userRepo.IsCorrectUser(model.Email, new Security().EncryptPassword(model.Password)))
                    if (_userRepo.IsCorrectUser(model.Email, model.Password))
                    {
                        RegisterViewModel userInfo = _userRepo.GetUserByEmail(model.Email);
                        var claims = new List<Claim>()
                        {
                            new Claim("name", userInfo.Name),
                            new Claim("Email", userInfo.Email),
                            new Claim("Role", userInfo.Role)
                        };

                        var ci = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                        HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(ci)).Wait();
                        return Ok(userInfo.Name);
                    }
                    else
                    {
                        _logger.LogError("email, password not matched");
                        return StatusCode(401);
                    }
                }
                else
                {
                    _userRepo.TryLogin(model.Email);
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex);
                return StatusCode(500, ex.Message);
            }
        }


        [HttpGet("Logout")]
        [Produces("application/json")]
        public IActionResult Logout()
        {
            try
            {
                HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme).Wait();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500);
            }
        }

        private bool isLoginFailed(string Email)
        {
            // is Registed User?
            if (_userRepo.IsRegistedUser(Email))
            {
                // attempt more than 5times and within 10 minutes
                if (_userRepo.IsFiveOverCount(Email) && _userRepo.IsLastLoginWithinTenMinute(Email))
                {
                    return true;
                }
                return false;
            }
            return false;
        }
    }
}