using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Next_Core_Blog.Model.BlogNote
{
    public class GetNote
    {
        [Display(Name = "번호")]
        public int NoteId { get; set; }
        [Display(Name = "제목")]
        [Required(ErrorMessage = "* 제목을 작성해 주세요")]
        public string Title { get; set; }
        [Display(Name = "내용")]
        [Required(ErrorMessage = "* 내용을 작성해 주세요")]
        public string Content { get; set; }
        public string PostDate { get; set; }
        public string ModifyDate { get; set; }
        public string ThumbImage { get; set; }
        public int CategoryId { get; set; }
        public int ReadCount { get; set; }
        public string PostIp { get; set; }
        public string ModifyIp { get; set; }
    }
}