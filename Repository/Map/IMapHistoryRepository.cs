using System.Collections;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using next_core_blog.Model.Map;

namespace next_core_blog.Repository.Map
{
    public interface IMapHistoryRepository
    {
        Task<IEnumerable<MapHistory>> GetLogHistoryAll();
        Task<IEnumerable<MapHistory>> GetLogHistoryDaily();
        Task<IEnumerable<MapCoordinate>> GetIpCooldinates();
        Task<IEnumerable<MapHistory>> GetNoteTitleByIp();
    }
}