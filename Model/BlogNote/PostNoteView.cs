using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Next_Core_Blog.Model.BlogNote
{
    public class PostNoteView
    {
        public int noteId { get; set; }
        public string title { get; set; }
        public int userId { get; set; }
        public string content { get; set; }
        public string thumbImage { get; set; }
        public string category { get; set; }
        public string subCategory { get; set; }
        public string postIp { get; set; }
        public string modifyIp { get; set; }
        public string isPost { get; set; }
        public string password { get; set; }

    }
}