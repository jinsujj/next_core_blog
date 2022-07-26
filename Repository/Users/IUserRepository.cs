using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using next_core_blog.Model.Oauth;
using Next_Core_Blog.Model.User;

namespace Next_Core_Blog.Repository.Users
{
    public interface IUserRepository
    {
        bool AddUser(RegisterViewModel model);
        void UpdateToken (string Email, string name, string Token);
        Task<RegisterViewModel> GetUserByEmail(string EMail);
        RegisterViewModel GetUserByUserId(int userId);
        bool IsCorrectUser(string Email, string password);
        void ModifyUser(RegisterViewModel model);
        bool IsAdmin(string Email);
        bool IsRegistedUser(string Emaill);
        void Log(string page, string ip);

        void TryLogin(string Email);
        void ClearLogin(string Email);
        bool IsFiveOverCount(string Email);
        bool IsLastLoginWithinTenMinute(string Email);
        Task<string> getKakaoToken(string Email);
    }

}