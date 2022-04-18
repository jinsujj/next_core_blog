using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Next_Core_Blog.Model.BlogNote
{
    public class Note
    {
        [Display(Name ="번호")]
        public int NoteId {get;set;}
        [Display(Name ="제목")]
        [Required(ErrorMessage ="* 제목을 작성해 주세요")]
        public string Title {get;set;}
        [Display(Name ="유저 번호")]
        public int UserId {get;set;}
        [Display(Name ="내용")]
        [Required(ErrorMessage ="* 내용을 작성해 주세요")]
        public string Content {get;set;}
        [Display(Name ="비밀번호")]
        [Required(ErrorMessage ="* 비밀번호를 입력해 주세요")]
        public string Password {get;set;}
        public string PostDate {get;set;}
        public string ModifyDate {get;set;}
        public string ThumbImage {get;set;}
        public string Category {get;set;}
        public string SubCategory {get;set;}
        public int ReadCount {get;set;}
        public char IsPost {get;set;}
        public string PostIp {get;set;}
        public string ModifyIp {get;set;}

    }
}