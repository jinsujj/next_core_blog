using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Logging;
using Next_Core_Blog.Context;
using Next_Core_Blog.Model.BlogNote;
using Next_Core_Blog.Model.User;

namespace Next_Core_Blog.Repository.Users
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

            string sql = @"INSERT INTO user (Name, Email, Password, FailedPasswordAttemptCount, Role, CreatedDate)
                            VALUES(@Name, @Email, @Password, 0, 'USER', NOW());";

            using (var con = _context.CreateConnection())
            {
                var checkResult = con.QueryFirstOrDefault<int>(checkSql, new {Email = model.Email});

                if(checkResult != 0 ){
                    _logger.LogError("Email already exist");
                    return false;
                }
                var result = con.Execute(sql, new { name = model.Name, email = model.Email, password = model.Password });
            }

            return true;
        }


        public async Task<RegisterViewModel> GetUserByEmail(string Email)
        {
            string sql = @"SELECT UserId, Name, Email, Role
                            FROM user
                            WHERE Email = @Email";

            using (var con = _context.CreateConnection())
            {
                var result = await con.QueryFirstAsync<RegisterViewModel>(sql, new { Email });
                return result;
            }
        }

        public bool IsRegistedUser(string Email)
        {
            string sql = @"SELECT 1
                            FROM user
                            WHERE Email = @Email";
            
            using (var con = _context.CreateConnection()){
                var result = con.QueryFirstOrDefault<bool>(sql, new{Email});
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

                if(result){
                    sql = @"UPDATE user SET LastLoggined = NOW() 
                            WHERE Email = @Email";
                    con.Execute(lastLoginSql, new {Email});
                }
                return result;
            }
        }

        public bool IsFiveOverCount(string Email)
        {
            string sql = @"SELECT FailedPasswordAttemptCount
                            FROM user
                            WHERE Email = @Email";
            
            using (var con = _context.CreateConnection()){
                int count = con.QueryFirstOrDefault<int>(sql, new {Email});
                if(count >= 5){
                    return true;
                }
            }

            return false;
        }

        public bool IsLastLoginWithinTenMinute(string Email)
        {
            string sql =@" SELECT TIMESTAMPDIFF(MINUTE, FailedPasswordAttemptTime, NOW())
                            FROM user
                            WHERE Email = @Email
                        ";

            using (var con = _context.CreateConnection()){
                var timediff = con.QueryFirstOrDefault<int>(sql, new {Email});
                if(timediff <= 10){
                    return true;
                }
            }

            return false;
        }


        public void Log(string Content, string Ip)
        {
            using(var con = _context.CreateConnection()){
                con.Execute(@"INSERT INTO userlog SET Content=@Content, Ip =@Ip, Date =NOW()", new {Content, Ip});
            }
        }

        public void ModifyUser(RegisterViewModel model)
        {
            string sql = @"UPDATE user 
                            SET Name = @Name,
                                Password =@Password
                            WHERE Email = @Email
                            ";
            using (var con = _context.CreateConnection()){
                con.Execute(sql, new {Name = model.Name, Password = model.Password, Email = model.Email});
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

            using(var con = _context.CreateConnection())                            {
                con.Execute(sql, new {Email});
            }
        }

        public void ClearLogin(string Email)
        {
            string sql = @"UPDATE user
                            SET failedpasswordattemptcount =0,
                                FailedPasswordAttemptTime = NOW()
                            WHERE Email = @Email";
            
            using (var con = _context.CreateConnection()){
                con.Execute(sql, new {Email});
            }
        }

    }
}