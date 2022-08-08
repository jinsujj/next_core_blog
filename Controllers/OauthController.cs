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
using Org.BouncyCastle.Bcpg;

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

        #region [ kakao Login ]
        [HttpPost("Kakao/Login")]
        [Produces("application/json")]
        public async Task<IActionResult> GetKaKaoProfileInfo([FromBody] kakaoToken kakaoToken)
        {
            _logger.LogInformation("GetKaKaoProfileInfo" + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss") + "  |  Token: " + kakaoToken.Token);
            try
            {
                // Decode kakao Token
                HttpWebRequest req = kakaoLoginRequest(kakaoToken.Token);
                kakaoProfile kakaoProfile = DecodeKakaoToken(req);

                // kakao email exist check
                if (String.IsNullOrEmpty(kakaoProfile.kakao_account.email))
                {
                    AccountCheckById(kakaoProfile, kakaoToken.Token);
                    return await createCookie(new kakaoPrimaryKey("", kakaoProfile.id.ToString()));
                }
                else
                {
                    AccountCheckByEmail(kakaoProfile, kakaoToken.Token);
                    return await createCookie(new kakaoPrimaryKey(kakaoProfile.kakao_account.email, ""));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        private HttpWebRequest kakaoLoginRequest(string token)
        {
            string url = "https://kapi.kakao.com/v2/user/me";
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
            req.Method = "POST";
            req.Timeout = 30 * 1000;
            req.Headers.Add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
            req.Headers.Add("Authorization", "Bearer " + token);
            req.UseDefaultCredentials = true;
            req.PreAuthenticate = true;
            req.Credentials = CredentialCache.DefaultCredentials;
            return req;
        }

        private kakaoProfile DecodeKakaoToken(HttpWebRequest req)
        {
            var jsonRst = kakaoReqResponse(req);
            var serializedJson = JsonConvert.SerializeObject(jsonRst);
            kakaoProfile kakaoProfile = JsonConvert.DeserializeObject<kakaoProfile>(serializedJson);
            return kakaoProfile;
        }

        private void AccountCheckById(kakaoProfile kakaoProfile, string token)
        {
            if (!_userRepo.IsRegistedUser(kakaoProfile.id.ToString()))
                RegistUserById(kakaoProfile, token);
            else
                _userRepo.UpdateKakaoProfile(kakaoProfile.kakao_account.email
                        , kakaoProfile.properties.nickname
                        , token
                        , kakaoProfile.kakao_account.profile.thumbnail_image_url
                        , kakaoProfile.kakao_account.profile.profile_image_url);
        }

        private void AccountCheckByEmail(kakaoProfile kakaoProfile, String token)
        {
            if (!_userRepo.IsRegistedUser(kakaoProfile.kakao_account.email))
                RegistUserByEmail(kakaoProfile, token);
            else
                _userRepo.UpdateKakaoProfile(kakaoProfile.kakao_account.email
                        , kakaoProfile.properties.nickname
                        , token
                        , kakaoProfile.kakao_account.profile.thumbnail_image_url
                        , kakaoProfile.kakao_account.profile.profile_image_url);
        }
        #endregion

        #region [ kakao Logout ]
        [HttpPost("Kakao/Logout")]
        [Produces("application/json")]
        public async Task<IActionResult> PostKakaoLogout([FromBody] kakaoPrimaryKey email)
        {
            _logger.LogInformation("PostKakaoLogout" + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss") + "  |  email: " + email.Email);
            string Token = await _userRepo.getKakaoToken(email.Email);
            try
            {
                HttpWebRequest req = kakaoLogoutRequest(Token);
                return Ok(kakaoReqResponse(req));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("401")) return Ok("Email login logout");
                return StatusCode(500, ex.Message);
            }
        }
        private HttpWebRequest kakaoLogoutRequest(string token)
        {
            string url = "https://kapi.kakao.com/v1/user/logout";
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
            req.Method = "POST";
            req.Timeout = 30 * 1000;
            req.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
            req.Headers.Add("Authorization", "Bearer " + token);
            req.UseDefaultCredentials = true;
            req.PreAuthenticate = true;
            req.Credentials = CredentialCache.DefaultCredentials;
            return req;
        }
        #endregion

        #region [ user Regist ]
        private void RegistUserById(kakaoProfile profile, string Token)
        {
            // kakao regist
            RegisterViewModel model = new RegisterViewModel();
            model.Email = profile.id.ToString();
            model.Name = profile.properties.nickname;
            model.Password = Token;
            model.Role = "USER";
            model.Oauth = "KAKAO";
            var data = _userRepo.AddUser(model);

            _logger.LogInformation("RegistUser: " + data);
        }
        private void RegistUserByEmail(kakaoProfile profile, string Token)
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
        #endregion

        #region [ cookie Create ]
        private async Task<IActionResult> createCookie([FromBody] kakaoPrimaryKey email_or_id)
        {
            try
            {
                string primaryKey = email_or_id.Email == "" ? email_or_id.Id : email_or_id.Email;
                RegisterViewModel userInfo = await _userRepo.GetUserByEmail(primaryKey);
                var claims = makeTokenClaims(userInfo);
                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity)).Wait();
                return Ok(userInfo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        private List<System.Security.Claims.Claim> makeTokenClaims(RegisterViewModel userInfo)
        {
            var claims = new List<Claim>()
                        {
                            new Claim("userId", userInfo.userId.ToString()),
                            new Claim("name", userInfo.Name),
                            new Claim("Email", userInfo.Email),
                            new Claim("Role", userInfo.Role)
                        };
            return claims;
        }
        #endregion

        #region [ Http Response ]
        private JObject kakaoReqResponse(HttpWebRequest req)
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
            return jsonRst;
        }
        #endregion
    }
}