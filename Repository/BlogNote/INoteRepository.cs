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
        int PostNote(Note note, BoardWriteFormType formType) ;
        int PostCategory(string Category, string SubCateghory);
        int DeleteNode (int id);

        // Get Note
        Task<IEnumerable<GetNote>> GetNoteAll();
        Task<IEnumerable<GetNote>> GetNoteByCategory(string category, string subCategory);
        Task<IEnumerable<GetNote>> GetNoteBySearch(string searchQuery);
        GetNote GetNoteById(int id);

        Task<int> GetCountAll();
    }
}