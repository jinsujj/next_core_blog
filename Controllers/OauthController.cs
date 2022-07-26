using System.Xml;
using System.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.IO;
using next_core_blog.Model.Oauth;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Next_Core_Blog.Repository.Users;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Next_Core_Blog.Model.User;

namespace next_core_blog.Controllers
{
    [Route("api/Oauth")]
    [ApiController]
    public class OauthController : ControllerBase
    {
        private readonly IWebHostEnvironment _enviorment;
        private readonly IConfiguration _config;
        private readonly ILogger<OauthController> _logger;
        private readonly IUserRepository _userRepo;


        public OauthController(IWebHostEnvironment enviorment, IConfiguration config, ILogger<OauthController> logger, IUserRepository userRepo)
        {
            this._enviorment = enviorment;
            this._config = config;
            this._logger = logger;
            this._userRepo = userRepo;
        }

        [HttpPost("Kakao/Login")]
        [Produces("application/json")]
        public async Task<IActionResult> GetKaKaoProfileInfo([FromBody] kakaoToken kakaoToken)
        {
            _logger.LogInformation("GetKaKaoProfileInfo" + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));
            _logger.LogInformation("Token: " + kakaoToken.Token);

            string url = "https://kapi.kakao.com/v2/user/me";
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
            req.Method = "POST";
            req.Timeout = 30 * 1000;
            req.Headers.Add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
            req.Headers.Add("Authorization", "Bearer " + kakaoToken.Token);
            req.UseDefaultCredentials = true;
            req.PreAuthenticate = true;
            req.Credentials = CredentialCache.DefaultCredentials;

            try
            {
                // Decode kakao Token
                var Dictionary = DecodeKakaoToken(req);

                // Check Logic is user Regist?
                if (!_userRepo.IsRegistedUser(Dictionary.kakao_account.email))
                    RegistUser(Dictionary, kakaoToken.Token);
                else
                    _userRepo.UpdateToken(Dictionary.kakao_account.email, Dictionary.properties.nickname, kakaoToken.Token);

                // Login By Email
                return  await LoginByEmail(new kakaoEmail(Dictionary.kakao_account.email));
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("Kakao/Logout")]
        [Produces("application/json")]
        public async Task<IActionResult> PostKakaoLogout([FromBody] kakaoEmail email)
        {
            // Refresh Accesscode and Token
            _logger.LogInformation("PostKakaoLogout" + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));
            _logger.LogInformation("email: " + email.Email);

            string Token = await _userRepo.getKakaoToken(email.Email);
            _logger.LogInformation("Token: " + Token);

            try
            {
                string url = "https://kapi.kakao.com/v1/user/logout";
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
                req.Method = "POST";
                req.Timeout = 30 * 1000;
                req.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
                req.Headers.Add("Authorization", "Bearer " + Token);
                req.UseDefaultCredentials = true;
                req.PreAuthenticate = true;
                req.Credentials = CredentialCache.DefaultCredentials;

                try
                {
                    string id = KakaoLogout(req);
                    return Ok(id);
                }
                catch (Exception ex)
                {
                    if (ex.Message.Contains("401"))
                    {
                        return Ok("local Login");
                    }
                    _logger.LogError("error" + ex.Message);
                    return StatusCode(500, ex.Message);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        private kakaoProfile DecodeKakaoToken(HttpWebRequest req)
        {
            JObject jsonRst;
            using (HttpWebResponse res = (HttpWebResponse)req.GetResponse())
            {
                HttpStatusCode status = res.StatusCode;
                _logger.LogInformation("status: " + status.ToString());

                Stream resStream = res.GetResponseStream();
                using (StreamReader sr = new StreamReader(resStream))
                {
                    jsonRst = JObject.Parse(sr.ReadToEnd());

                }
            }
            var json = JsonConvert.SerializeObject(jsonRst);
            var Dictionary = JsonConvert.DeserializeObject<kakaoProfile>(json);
            return Dictionary;
        }

        private string KakaoLogout(HttpWebRequest req)
        {
            JObject jsonRst;
            using (HttpWebResponse res = (HttpWebResponse)req.GetResponse())
            {
                HttpStatusCode status = res.StatusCode;
                _logger.LogInformation("status: " + status.ToString());

                Stream resStream = res.GetResponseStream();
                using (StreamReader sr = new StreamReader(resStream))
                {
                    jsonRst = JObject.Parse(sr.ReadToEnd());
                }
            }
            var json = JsonConvert.SerializeObject(jsonRst);
            return json;
        }

        private void RegistUser(kakaoProfile profile, string Token)
        {
            // kakao regist
            RegisterViewModel model = new RegisterViewModel();
            model.Email = profile.kakao_account.email;
            model.Name = profile.properties.nickname;
            model.Password = Token;
            model.Role = "USER";
            model.Oauth = "KAKAO";
            var data = _userRepo.AddUser(model);
            _logger.LogInformation("RegistUser: " + data);
        }

        private async Task<IActionResult> LoginByEmail([FromBody] kakaoEmail email)
        {
            _logger.LogInformation("LoginByEmail: " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));
            _logger.LogInformation("email " + email.Email);

            try
            {
                RegisterViewModel userInfo = await _userRepo.GetUserByEmail(email.Email);
                var claims = new List<Claim>()
                        {
                            new Claim("userId", userInfo.userId.ToString()),
                            new Claim("name", userInfo.Name),
                            new Claim("Email", userInfo.Email),
                            new Claim("Role", userInfo.Role)
                        };

                var ci = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(ci)).Wait();

                return Ok(userInfo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}