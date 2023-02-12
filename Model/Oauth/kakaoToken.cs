using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace next_core_blog.Model.Oauth
{
    public class KakaoUserTokenParam
    {
        public string code { get; set; }
    }

    public class KakaoLoginParam
    {
        public string token { get; set; }
    }
    public class KakaoAccessToken
    {
        public string access_token { get; set; }
    }
}