using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Next_Core_Blog.Model.User
{
    public class RegisterViewModel
    {
        public int userId { get; set; }

        [Required(ErrorMessage = "이름을 입력해주세요")]
        public string name { get; set; }

        [EmailAddress(ErrorMessage = "E-mail 형식이 아닙니다")]
        public string email { get; set; }

        [Required(ErrorMessage = "패스워드를 입력해주세요")]
        [DataType(DataType.Password)]
        public string password { get; set; }

        [Required(ErrorMessage = "패스워드를 입력해주세요")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "패스워드가 일치하지 않습니다")]
        public string confirmPassword { get; set; }
        public string role { get; set; }
        public string oauth { get; set; }
    }
}