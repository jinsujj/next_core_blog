using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Logging;
using next_core_blog.Model.Map;
using next_core_blog.Context;

namespace next_core_blog.Repository.Map
{
    public class MapHistoryRepository : IMapHistoryRepository
    {
        private readonly DapperContext _context;
        private ILogger<MapHistoryRepository> _logger;

        public MapHistoryRepository(DapperContext context, ILogger<MapHistoryRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<MapHistory>> GetLogHistoryAll()
        {
            String sql = @"SELECT a.ip, a.date, b.title ,c.country, c.countryCode,
                                 c.city, c.lat, c.lon, c.timezone, c.isp
                            FROM userlog a 
                            LEFT JOIN note b
                            ON a.content = b.noteid 
                            LEFT JOIN ipInfo c
                            ON a.ip = c.query
                            ORDER BY DATE DESC";

            using (var con = _context.CreateConnection())
            {
                var mapHistoryList = await con.QueryAsync<MapHistory>(sql);
                return mapHistoryList.ToList();
            }
        }

        public async Task<IEnumerable<MapHistory>> GetLogHistoryDaily()
        {
            string sql = @"SELECT ip, date, title, country, countryCode, city, lat, lon, timezone, isp
                            FROM (
                                SELECT a.ip, a.date, b.title ,c.country, c.countryCode,
                                        c.city, c.lat, c.lon, c.timezone, c.isp
                                FROM userlog a 
                                LEFT JOIN note b
                                ON a.content = b.noteid 
                                LEFT JOIN ipInfo c
                                ON a.ip = c.query
                            ) hist
                            WHERE hist.date >= date_add(now(), interval -1 day)
                            ORDER BY hist.date DESC"
                    ;

            using (var con = _context.CreateConnection())
            {
                var mapHistoryList = await con.QueryAsync<MapHistory>(sql);
                return mapHistoryList.ToList();
            }
        }

        public async Task<IEnumerable<MapCoordinate>> GetIpCooldinates()
        {
            string sql = @"SELECT a.ip, b.lat, b.lon
                            FROM userlog a INNER JOIN ipInfo b                            
                            ON a.ip = b.query
                            AND a.date >= date_add(now() , interval -1 day)
                            ORDER BY a.date DESC
                            ";

            using (var con = _context.CreateConnection())
            {
                var mapCoordinate = await con.QueryAsync<MapCoordinate>(sql);
                return mapCoordinate.ToList();
            }
        }

        public async Task<IEnumerable<MapHistory>> GetNoteTitleByIp()
        {
            string sql = @"SELECT ip, title 
                            FROM (
                                SELECT ip, date, title, country, countryCode, city, lat, lon, timezone, isp
                                FROM (
                                    SELECT a.ip, a.date, b.title ,c.country, c.countryCode,
                                            c.city, c.lat, c.lon, c.timezone, c.isp
                                    FROM userlog a 
                                    LEFT JOIN note b
                                    ON a.content = b.noteid 
                                    LEFT JOIN ipInfo c
                                    ON a.ip = c.query
                                    ORDER BY DATE desc
                                ) hist
                                WHERE hist.date >= date_add(now(), interval -1 day)
                            ) a            
                            GROUP BY a.ip ,a.title"
                            ;

            using (var con = _context.CreateConnection())
            {
                var mapCoordinate = await con.QueryAsync<MapHistory>(sql);
                return mapCoordinate.ToList();
            }
        }



    }
}
