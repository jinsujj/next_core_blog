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
using System.Net.Http;
using System.Text;
using System.Net.Http.Headers;

namespace next_core_blog.Controllers
{
    [Route("api/Oauth")]
    [ApiController]
    public class OauthController : ControllerBase
    {
        private const string kakaoLogin = "https://kapi.kakao.com/v2/user/me";
        private const string kakaoLogout = "https://kapi.kakao.com/v1/user/logout";
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
                var response = kakaoRequest(kakaoLogin, kakaoToken.Token).Result;
                var kakaoProfile = JsonConvert.DeserializeObject<kakaoProfile>(JsonToString(response));

                //카카오 로그인 시, 카카오 이메일 없는 경우가 있어서 로직 분기 처리함.
                if (String.IsNullOrEmpty(kakaoProfile.kakao_account.email))
                {
                    AccountCheckById(kakaoProfile, kakaoToken.Token);
                    return await CreateCookie(new kakaoPrimaryKey("", kakaoProfile.id.ToString()));
                }
                else
                {
                    AccountCheckByEmail(kakaoProfile, kakaoToken.Token);
                    return await CreateCookie(new kakaoPrimaryKey(kakaoProfile.kakao_account.email, ""));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
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
            string kakaoToken = await _userRepo.getKakaoToken(email.Email);
            try
            {
                HttpResponseMessage response = kakaoRequest(kakaoLogout, kakaoToken).Result;
                return Ok(JsonToString(response));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("401")) return Ok("Email login logout");
                return StatusCode(500, ex.Message);
            }
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
        private async Task<IActionResult> CreateCookie([FromBody] kakaoPrimaryKey email_or_id)
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

        #region [ Http Control ]
        private static async Task<HttpResponseMessage> kakaoRequest(string url, string token)
        {
            var httpClientHandler = new HttpClientHandler()
            {
                UseDefaultCredentials = true,
                PreAuthenticate = true,
                Credentials = CredentialCache.DefaultCredentials,
            };

            using (var client = new HttpClient(httpClientHandler))
            {
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                client.Timeout = new TimeSpan(0, 3, 0);

                StringContent tokenContent = new StringContent(token, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(url, tokenContent);
                response.EnsureSuccessStatusCode();
                return response;
            }
        }

        private String JsonToString(HttpResponseMessage response)
        {
            JObject jsonRst;
            Stream stream = response.Content.ReadAsStream();
            using (StreamReader sr = new StreamReader(stream))
            {
                jsonRst = JObject.Parse(sr.ReadToEnd());
                return JsonConvert.SerializeObject(jsonRst);
            }
        }
        #endregion
    }
}