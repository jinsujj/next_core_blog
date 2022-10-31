using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using next_core_blog.Model.Map;

namespace next_core_blog.Repository.Map
{
    public interface IMapHistoryRepository
    {
        Task<IEnumerable<mapHistory>> getLogHistoryAll();
        Task<IEnumerable<mapHistory>> getLogHistoryDaily();
    }
}