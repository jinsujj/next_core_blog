using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace next_core_blog.Model.User
{
    public class LoginViewModel
    {
        [EmailAddress(ErrorMessage = "E-mail 형식이 아닙니다")]
        public string email { get; set; }
        [Required(ErrorMessage = "패스워드를 입력해주세요")]
        public string password { get; set; }
    }

}
