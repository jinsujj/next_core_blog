using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace next_core_blog.Model.BlogNote
{
    public class Note
    {
        [Display(Name = "번호")]
        public int noteId { get; set; }
        [Display(Name = "제목")]
        [Required(ErrorMessage = "* 제목을 작성해 주세요")]
        public string title { get; set; }
        [Display(Name = "유저 번호")]
        public int userId { get; set; }
        [Display(Name = "내용")]
        [Required(ErrorMessage = "* 내용을 작성해 주세요")]
        public string content { get; set; }
        [Display(Name = "비밀번호")]
        [Required(ErrorMessage = "* 비밀번호를 입력해 주세요")]
        public string password { get; set; }
        public string postDate { get; set; }
        public string modifyDate { get; set; }
        public string thumbImage { get; set; }
        public string category { get; set; }
        public string subCategory { get; set; }
        public int readCount { get; set; }
        public char isPost { get; set; }
        public string postIp { get; set; }
        public string modifyIp { get; set; }

    }
}