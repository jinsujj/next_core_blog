using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Next_Core_Blog.Model.BlogNote
{
    public class User
    {
        public int UserId {get;set;}
        public string Name {get;set;}
        public string Email {get;set;}
        public string Password {get;set;}
        public DateTime CreatedDate {get;set;}
        public DateTime LastLoggined {get;set;}
        public int FailedPasswordAttemptCount {get;set;}
        public DateTime FailedPasswordAttemptTime {get;set;}
    }
}