using System.Collections.Generic;
using System.Threading.Tasks;
using next_core_blog.Model.BlogNote;

namespace next_core_blog.Repository.BlogNote
{
    public interface INoteRepository
    {
        // Note CRUD
        int PostNote(PostNoteView note, BoardWriteFormType formType);
        int PostCategory(string Category, string SubCateghory);
        int DeleteNote(int id);

        // Get Note
        Task<IEnumerable<Summary>> GetSummary();
        Task<IEnumerable<GetNote>> GetNoteAll(int userId);
        Task<IEnumerable<GetNote>> GetNoteByCategory(int userId, string category, string subCategory);
        Task<IEnumerable<GetNote>> GetNoteBySearch(string searchQuery);
        Task<GetNote> GetNoteById(int id, int userId, string ip);

        Task<IEnumerable<CategoryViewModel>> GetNoteCategoryList();
        Task<IEnumerable<SidebarCategoryViewModel>> GetSidebarCategoryList();

        Task<int> GetTotalReadCount();
        Task<int> GetTodayReadCount();
        Task<int> PostIpLog(IpLocationInfo logModel);
    }
}