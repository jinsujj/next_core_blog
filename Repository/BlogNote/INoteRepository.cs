using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Next_Core_Blog.Model.BlogNote;

namespace Next_Core_Blog.Repository.BlogNote
{
    public interface INoteRepository
    {
        // Note CRUD
        int PostNote(PostNoteView note, BoardWriteFormType formType) ;
        int PostCategory(string Category, string SubCateghory);
        int DeleteNode (int id);

        // Get Note
        Task<IEnumerable<GetNote>> GetNoteAll(int userId);
        Task<IEnumerable<GetNote>> GetNoteByCategory(int userId, string category, string subCategory);
        Task<IEnumerable<GetNote>> GetNoteBySearch(string searchQuery);
        Task<GetNote> GetNoteById(int id, int userId, string ip);

        Task<IEnumerable<CategoryViewModel>> getNoteCategoryList();
        Task<IEnumerable<SidebarCategoryViewModel>> GetSidebarCategoryList();

        Task<int> GetCountAll();
        Task<int> getTotalReadCount();
        Task<int> getTodayReadCount();
        Task<int> postIpLog(IpLogModel logModel);
    }
}