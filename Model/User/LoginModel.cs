using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Next_Core_Blog.Model.User
{
    public class LoginModel
    {
        [EmailAddress(ErrorMessage ="E-mail 형식이 아닙니다")]
        public string Email {get;set;}
        [Required(ErrorMessage ="패스워드를 입력해주세요")]
        [DataType(DataType.Password)]
        public string Password {get;set;}
    }
}