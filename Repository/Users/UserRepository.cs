using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Logging;
using next_core_blog.Model.Oauth;
using next_core_blog.Context;
using next_core_blog.Model.BlogNote;
using next_core_blog.Model.User;

namespace next_core_blog.Repository.Users
{
    public class UserRepository : IUserRepository
    {
        private readonly DapperContext _context;
        private ILogger<UserRepository> _logger;

        public UserRepository(DapperContext context, ILogger<UserRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public bool AddUser(RegisterViewModel model)
        {
            string checkSql = "SELECT COUNT(*) FROM user WHERE Email = @Email";

            string sql =
            @"INSERT INTO user (Name, Email, Password, FailedPasswordAttemptCount, Role,     
                                CreatedDate, Oauth)
            VALUES(@Name, @Email, @Password, 0, 'USER', NOW(), @Oauth);";

            using (var con = _context.CreateConnection())
            {
                var checkResult = con.QueryFirstOrDefault<int>(checkSql, new { Email = model.email });

                if (checkResult != 0)
                {
                    _logger.LogError("Email already exist");
                    return false;
                }
                var result = con.Execute(sql, new { name = model.name, email = model.email, password = model.password, Oauth = model.oauth });
            }

            return true;
        }

        public async void UpdateKakaoProfile(string Email, string Name, string Token, string thumbnail_image_url, string profile_image_url)
        {
            string sql = @"UPDATE user SET password = @Token , name = @Name, thumbnail_image_url =@thumbnail_image_url, image_url =@profile_image_url
                            WHERE email = @Email
                            ";
            using (var con = _context.CreateConnection())
            {
                var result = await con.ExecuteAsync(sql, new { Email, Name, Token, thumbnail_image_url, profile_image_url });
            }
        }

        public async Task<RegisterViewModel> GetUserByEmail(string Email_or_Id)
        {
            string sql = @"SELECT UserId, Name, Email, Role, Oauth
                            FROM user
                            WHERE Email = @Email_or_Id";

            using (var con = _context.CreateConnection())
            {
                var result = await con.QueryFirstAsync<RegisterViewModel>(sql, new { Email_or_Id });
                return result;
            }
        }

        public RegisterViewModel GetUserByUserId(int UserId)
        {
            string sql = @"SELECT UserId, Name, Email, Role
                            FROM user
                            WHERE userId = @UserId";

            using (var con = _context.CreateConnection())
            {
                var result = con.QueryFirstOrDefault<RegisterViewModel>(sql, new { UserId });
                return result;
            }
        }

        public bool IsRegistedUser(string Email_or_Id)
        {
            string sql = @"SELECT 1
                            FROM user
                            WHERE Email = @Email_or_Id";

            using (var con = _context.CreateConnection())
            {
                var result = con.QueryFirstOrDefault<bool>(sql, new { Email_or_Id });
                return result;
            }
        }

        public bool IsAdmin(string Email)
        {
            string sql = @"SELECT 1
                          FROM user
                          WHERE Email = @Email";

            using (var con = _context.CreateConnection())
            {
                var result = con.QueryFirstOrDefault<bool>(sql, new { Email });
                return result;
            }
        }

        public bool IsCorrectUser(string Email, string Password)
        {
            bool result = false;

            string sql = @"SELECT 1
                           FROM user
                           WHERE Email = @Email
                           AND Password = @Password
                           ";

            string lastLoginSql = @"UPDATE user SET LastLoggined = NOW() 
                                    WHERE Email = @Email";

            using (var con = _context.CreateConnection())
            {
                result = con.QueryFirstOrDefault<bool>(sql, new { Email, Password });

                if (result)
                {
                    sql = @"UPDATE user SET LastLoggined = NOW() 
                            WHERE Email = @Email";
                    con.Execute(lastLoginSql, new { Email });
                }
                return result;
            }
        }

        public bool IsFiveOverCount(string Email)
        {
            string sql = @"SELECT FailedPasswordAttemptCount
                            FROM user
                            WHERE Email = @Email";

            using (var con = _context.CreateConnection())
            {
                int count = con.QueryFirstOrDefault<int>(sql, new { Email });
                if (count >= 5)
                {
                    return true;
                }
            }

            return false;
        }

        public bool IsLastLoginWithinTenMinute(string Email)
        {
            string sql = @" SELECT TIMESTAMPDIFF(MINUTE, FailedPasswordAttemptTime, NOW())
                            FROM user
                            WHERE Email = @Email
                        ";

            using (var con = _context.CreateConnection())
            {
                var timediff = con.QueryFirstOrDefault<int>(sql, new { Email });
                if (timediff <= 10)
                {
                    return true;
                }
            }

            return false;
        }


        public void SetLog(string Content, string Ip)
        {
            using (var con = _context.CreateConnection())
            {
                con.Execute(@"INSERT INTO userlog SET Content=@Content, Ip =@Ip, Date =NOW()", new { Content, Ip });
            }
        }

        public void ModifyUser(RegisterViewModel Model)
        {
            string sql = @"UPDATE user 
                            SET Name = @Name,
                                Password =@Password
                            WHERE Email = @Email
                            ";
            using (var con = _context.CreateConnection())
            {
                con.Execute(sql, new { Name = Model.name, Password = Model.password, Email = Model.email });
            }
        }

        public void TryLogin(string Email)
        {
            string sql = @" UPDATE user
                            SET FailedPasswordAttemptCount = FailedPasswordAttemptCount +1 ,
                                FailedPasswordAttemptTime = NOW(),
                                LastLoggined = NOW()
                            WHERE Email = @Email
                            ";

            using (var con = _context.CreateConnection())
            {
                con.Execute(sql, new { Email });
            }
        }

        public void ClearLogin(string Email)
        {
            string sql = @"UPDATE user
                            SET failedpasswordattemptcount =0,
                                FailedPasswordAttemptTime = NOW()
                            WHERE Email = @Email";

            using (var con = _context.CreateConnection())
            {
                con.Execute(sql, new { Email });
            }
        }

        public async Task<string> GetKakaoToken(string Email)
        {
            string sql = @"SELECT password as Token, Oauth
                            FROM user
                            WHERE email =@Email";
            using (var con = _context.CreateConnection())
            {
                return await con.QueryFirstAsync<string>(sql, new { Email });
            }
        }
    }
}