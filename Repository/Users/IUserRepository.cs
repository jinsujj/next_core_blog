using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Next_Core_Blog.Model.User;

namespace Next_Core_Blog.Repository.Users
{
    public interface IUserRepository
    {
        void AddUser(RegisterViewModel model);
        RegisterViewModel GetUserByEmail(string EMail);
        bool IsCorrectUser(string Email, string password);
        void ModifyUser(RegisterViewModel model);
        bool IsAdmin(string Email);
        bool IsRegistedUser(string Emaill);
        void Log(string page, string ip);

        void TryLogin(string Email);
        void ClearLogin(string Email);
        bool IsFiveOverCount(string Email);
        bool IsLastLoginWithinTenMinute(string Email);
    }

}