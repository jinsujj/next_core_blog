using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace Next_Core_Blog.Context
{
    /*
        Context 란?
        호출, 응답 간의 환경 정보.
        일반적인 환경 설정 정보와는 다르게 Runtime 시에 생성되는 정보
    */
    public class DapperContext
    {
        private readonly IConfiguration _config;
        private readonly string _ConnectionString;

        public DapperContext(IConfiguration config)
        {
            // Access for root Dir appsettings.json
            _config = config;
            _ConnectionString = _config.GetConnectionString("SuwonConnection");
        }

        public IDbConnection CreateConnection()
        {
            return new MySqlConnection(_ConnectionString);
        }

        public IConfiguration GetConfig()
        {
            return _config;
        }
    }
}