using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace next_core_blog.Model.Oauth
{
    public class kakaoPrimaryKey
    {
        public string Email {get;set;}
        public string Id {get;set;}

        public kakaoPrimaryKey(string email, string id){
            this.Email = email;
            this.Id = id;
        }
    }
}