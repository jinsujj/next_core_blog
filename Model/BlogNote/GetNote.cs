using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace next_core_blog.Model.BlogNote
{
    public class GetNote
    {
        [Display(Name = "번호")]
        public int noteId { get; set; }
        [Display(Name = "제목")]
        [Required(ErrorMessage = "* 제목을 작성해 주세요")]
        public string title { get; set; }
        [Display(Name = "내용")]
        [Required(ErrorMessage = "* 내용을 작성해 주세요")]
        public string content { get; set; }
        public int userId { get; set; }
        public string postDate { get; set; }
        public string modifyDate { get; set; }
        public string thumbImage { get; set; }
        public string category { get; set; }
        public string subCategory { get; set; }
        public int readCount { get; set; }
        public string postIp { get; set; }
        public string modifyIp { get; set; }
        public string isPost { get; set; }
    }
}