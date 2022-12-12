using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace next_core_blog.Model.BlogNote
{
    public class UserLog
    {
        public string ip { get; set; }
        public string content { get; set; }
        public DateTime date { get; set; }
    }
}