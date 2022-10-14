using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace next_core_blog.Model.Oauth
{
    public class KakaoEmail
    {
        public string email { get; set; }
        public string id { get; set; }

        public KakaoEmail(string email, string id)
        {
            this.email = email;
            this.id = id;
        }
    }
}