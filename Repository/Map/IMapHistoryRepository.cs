using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Next_core_blog.Model.Map;

namespace Next_core_blog.Repository.Map
{
    public interface IMapHistoryRepository
    {
        Task<IEnumerable<MapHistory>> GetLogHistoryAll();
        Task<IEnumerable<MapHistory>> GetLogHistoryDaily();
        Task<IEnumerable<MapCoordinate>> GetMapCooldinates();
    }
}