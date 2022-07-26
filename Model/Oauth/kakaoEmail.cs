using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace next_core_blog.Model.Oauth
{
    public class kakaoEmail 
    {
        public string Email {get;set;}

        public kakaoEmail(string email){
            this.Email = email;
        }
    }
}