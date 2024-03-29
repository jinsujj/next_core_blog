using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using next_core_blog.Model.Oauth;
using next_core_blog.Model.User;

namespace next_core_blog.Repository.Users
{
    public interface IUserRepository
    {
        bool AddUser(RegisterViewModel model);
        void UpdateKakaoProfile(string Email, string name, string Token, string thumbnail_image_url, string profile_image_url);
        Task<RegisterViewModel> GetUserByEmail(string Email_or_Id);
        RegisterViewModel GetUserByUserId(int userId);
        bool IsCorrectUser(string Email, string password);
        void ModifyUser(RegisterViewModel model);
        bool IsAdmin(string Email);
        bool IsRegistedUser(string Email_or_Id);
        void SetLog(string page, string ip);

        void TryLogin(string Email);
        void ClearLogin(string Email);
        bool IsFiveOverCount(string Email);
        bool IsLastLoginWithinTenMinute(string Email);
        Task<string> GetKakaoToken(string Email);
    }

}