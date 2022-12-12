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
using next_core_blog.Repository.Users;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using next_core_blog.Model.User;
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
        public async Task<IActionResult> GetKaKaoProfileInfo([FromBody] KakaoToken kakaoToken)
        {
            _logger.LogInformation("GetKaKaoProfileInfo" + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss") + "  |  Token: " + kakaoToken.token);
            try
            {
                var response = KakaoRequest(kakaoLogin, kakaoToken.token).Result;
                var kakaoProfile = JsonConvert.DeserializeObject<KakaoProfile>(
                    JsonToString(response));

                //카카오 로그인 시, 카카오 이메일 없는 경우가 있어서 로직 분기 처리함.
                if (String.IsNullOrEmpty(kakaoProfile.kakao_account.email))
                {
                    AccountCheckById(kakaoProfile, kakaoToken.token);
                    return await CreateCookie(new KakaoEmail("", kakaoProfile.id.ToString()));
                }
                else
                {
                    AccountCheckByEmail(kakaoProfile, kakaoToken.token);
                    return await CreateCookie(new KakaoEmail(kakaoProfile.kakao_account.email, ""));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("error" + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        private void AccountCheckById(KakaoProfile kakaoProfile, string token)
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

        private void AccountCheckByEmail(KakaoProfile kakaoProfile, String token)
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
        public async Task<IActionResult> PostKakaoLogout([FromBody] KakaoEmail email)
        {
            _logger.LogInformation(
                "PostKakaoLogout" + " " + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss") + "  |  email: " + email.email);
            string kakaoToken = await _userRepo.GetKakaoToken(email.email);
            try
            {
                HttpResponseMessage response = KakaoRequest(kakaoLogout, kakaoToken).Result;
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
        private void RegistUserById(KakaoProfile profile, string Token)
        {
            // kakao regist
            RegisterViewModel model = new RegisterViewModel();
            model.email = profile.id.ToString();
            model.name = profile.properties.nickname;
            model.password = Token;
            model.role = "USER";
            model.oauth = "KAKAO";
            var data = _userRepo.AddUser(model);

            _logger.LogInformation("RegistUser: " + data);
        }
        private void RegistUserByEmail(KakaoProfile profile, string Token)
        {
            // kakao regist
            RegisterViewModel model = new RegisterViewModel();
            model.email = profile.kakao_account.email;
            model.name = profile.properties.nickname;
            model.password = Token;
            model.role = "USER";
            model.oauth = "KAKAO";
            var data = _userRepo.AddUser(model);

            _logger.LogInformation("RegistUser: " + data);
        }
        #endregion

        #region [ cookie Create ]
        private async Task<IActionResult> CreateCookie([FromBody] KakaoEmail email_or_id)
        {
            try
            {
                string primaryKey = email_or_id.email == "" ? email_or_id.id : email_or_id.email;
                var userInfo = await _userRepo.GetUserByEmail(primaryKey);
                var claims = MakeTokenClaims(userInfo);
                var claimsIdentity = new ClaimsIdentity(
                    claims, CookieAuthenticationDefaults.AuthenticationScheme);

                HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity)).Wait();
                return Ok(userInfo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        private List<System.Security.Claims.Claim> MakeTokenClaims(RegisterViewModel userInfo)
        {
            var claims = new List<Claim>()
                        {
                            new Claim("userId", userInfo.userId.ToString()),
                            new Claim("name", userInfo.name),
                            new Claim("Email", userInfo.email),
                            new Claim("Role", userInfo.role)
                        };
            return claims;
        }
        #endregion

        #region [ Http Control ]
        private static async Task<HttpResponseMessage> KakaoRequest(string url, string token)
        {
            var httpClientHandler = new HttpClientHandler()
            {
                UseDefaultCredentials = true,
                PreAuthenticate = true,
                Credentials = CredentialCache.DefaultCredentials,
            };

            using (var client = new HttpClient(httpClientHandler))
            {
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                client.Timeout = new TimeSpan(0, 3, 0);

                var tokenContent = new StringContent(token, Encoding.UTF8, "application/json");
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