using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace next_core_blog.Model.BlogNote
{
    public class User
    {
        public int userId { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public DateTime createdDate { get; set; }
        public DateTime lastLoggined { get; set; }
        public int failedPasswordAttemptCount { get; set; }
        public DateTime failedPasswordAttemptTime { get; set; }
    }
}