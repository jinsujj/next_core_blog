using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Next_Core_Blog.Model.BlogNote;
using Dapper;
using Next_Core_Blog.Context;
using System.Data;

namespace Next_Core_Blog.Repository.BlogNote
{
    public class NoteRepository : INoteRepository
    {
        private readonly DapperContext _context;
        private ILogger<NoteRepository> _logger;

        public NoteRepository(DapperContext context, ILogger<NoteRepository> logger)
        {
            _context = context;
            _logger = logger;
        }


        public int DeleteNode(int id)
        {
            string sql = @"UPDATE note SET IsPost = 'D' WHERE noteId = @id
                        ";

            using (var con = _context.CreateConnection())
            {
                return con.Execute(sql, new { id = id });
            }
        }

        public async Task<int> GetCountAll()
        {
            string sql = @"SELECT COUNT(*)
                            FROM note
                            WHERE isPost ='Y'
                        ";

            using (var con = _context.CreateConnection())
            {
                var result = await con.QueryFirstOrDefaultAsync<int>(sql);
                return result;
            }
        }

        public async Task<IEnumerable<GetNote>> GetNoteAll()
        {
            string sql = @"SELECT noteId, title, userId, content, postDate, modifyDate, thumbImage, categoryId, readCount, postIp, modifyIp
                            FROM note
                            WHERE isPost = 'Y'
                        ";

            using (var con = _context.CreateConnection())
            {
                var notes = await con.QueryAsync<GetNote>(sql);
                return notes.ToList();
            }
        }

        public async Task<IEnumerable<GetNote>> GetNoteByCategory(string category, string subCategory = "")
        {
            string ParamCategory = "";
            string ParamSubCategory = "";

            if (!string.IsNullOrEmpty(category)) ParamCategory = "AND b.Name = @category";
            if (!string.IsNullOrEmpty(subCategory)) ParamSubCategory = "AND c.Name = @subCategory";

            string sql = string.Format(@"SELECT *
                            FROM note a
                            WHERE a.CategoryId IN (
                                SELECT b.CategoryId
                                FROM category b, subcategory c
                                WHERE b.CategoryId = c.CategoryId
                                {0}
                                {1}
                            )
                            AND IsPost ='Y'
                        ", ParamCategory, ParamSubCategory);

            using (var con = _context.CreateConnection())
            {
                var notes = await con.QueryAsync<GetNote>(sql, new { category, subCategory });
                return notes.ToList();
            }
        }

        public GetNote GetNoteById(int id)
        {
            string sql = @"SELECT noteId, title, userId, content, postDate, modifyDate, thumbImage, categoryId, readCount, postIp, modifyIp
                            FROM note
                            WHERE NoteId = @id
                            AND IsPost ='Y'
                        ";

            var con = _context.CreateConnection();
            return con.QuerySingleOrDefault<GetNote>(sql, new { id });
        }

        public async Task<IEnumerable<GetNote>> GetNoteBySearch(string searchQuery)
        {
            string sql = @"SELECT *
                            FROM note
                            WHERE Title LIKE @searchQuery
                            OR Content LIKE @searchQuery
                            AND IsPost ='Y'
                          ";

            using (var con = _context.CreateConnection())
            {
                var notes = await con.QueryAsync<GetNote>(sql, new { searchQuery = "%" + searchQuery + "%" });
                return notes.ToList();
            }
        }

        public int PostCategory(string Category, string SubCategory = "")
        {
            // Category 유무 Check
            string sql = @"SELECT CategoryId FROM category WHERE Name = @Category";
            string insertCategory = @"INSERT INTO category (Name) VALUES (@Category)";
            string insertSubCategory = @"INSERT INTO subcategory (CategoryId, Name) VALUES (@CategoryId ,@SubCategory)";

            using (var con = _context.CreateConnection())
            {
                int isCategoryExist = con.QueryFirstOrDefault<int>(sql, new { Category });

                // Category new create
                if (isCategoryExist == 0)
                {
                    con.QueryFirstOrDefault<int>(insertCategory, new { Category });
                    int CategoryId = con.QueryFirstOrDefault<int>(sql, new { Category });
                    con.QueryFirstOrDefault(insertSubCategory, new { CategoryId = CategoryId , SubCategory });
                    return 1;
                }
                // Category add  
                else
                {
                    if (!String.IsNullOrEmpty(SubCategory)){
                         con.QueryFirstOrDefault(insertSubCategory, new { CategoryId =isCategoryExist, SubCategory });
                         return 1;
                    }
                }
                return -1;
            }
        }

        public int PostNote(Note note, BoardWriteFormType formType)
        {
            int result = 0;
            var param = new DynamicParameters();
            string sql = "";

            param.Add("@Title", value: note.Title, dbType: DbType.String);
            param.Add("@UserId", value: note.UserId, dbType: DbType.Int32);
            param.Add("@Content", value: note.Content, dbType: DbType.String);
            param.Add("@Password", value: note.Password, dbType: DbType.String);
            param.Add("@ThumbImage", value: note.ThumbImage, dbType: DbType.String);
            param.Add("@IsPost", value: note.IsPost, dbType: DbType.String);
            param.Add("@CategoryId", value: note.CategoryId, dbType: DbType.String);

            if (formType == BoardWriteFormType.create)
            {
                param.Add("@PostIp", value: note.PostIp, dbType: DbType.String);

                sql = @"INSERT INTO note (Title, UserId, Content, Password, ThumbImage, IsPost, PostDate, PostIp, CategoryId)
                        VALUES (@Title, @UserId, @Content, @Password, @ThumbImage, 'N', Now(), @PostIp, @CategoryId)";
            }
            else if (formType == BoardWriteFormType.modify)
            {
                param.Add("@NoteId", value: note.NoteId, dbType: DbType.Int32);
                param.Add("@ModifyIp", value: note.ModifyIp, dbType: DbType.String);

                sql = @"UPDATE note
                        SET title = @Title,
                            UserId = @UserId,
                            Content = @Content,
                            Password = @Password,
                            ThumbImage = @ThumbImage,
                            IsPost = @IsPost,
                            ModifyDate = NOW(),
                            ModifyIp = @ModifyIp,
                            CategoryId = @CategoryId
                        WHERE noteId = @NoteId
                        ";
            }

            using (var con = _context.CreateConnection())
            {
                result = con.Execute(sql, param, commandType: CommandType.Text);
                return result;
            }
        }
    }

    public enum BoardWriteFormType
    {
        create,
        modify
    }
}