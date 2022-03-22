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
        int PostNode(Note note, BoardWriteFormType formType) ;
        int DeleteNode (int id);

        // Get Note
        Task<IEnumerable<Note>> GetNoteAll();
        Task<IEnumerable<Note>> GetNoteByCategory(int categoryId, int subCategoryId );
        Task<IEnumerable<Note>> GetNoteBySearch(string searchQuery);
        Note GetNoteById(int id);

        Task<int> GetCountAll();
    }
}