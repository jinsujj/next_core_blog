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
            string sql = @"SELECT noteId, title, userId, content, postDate, modifyDate, thumbImage, category, subCategory, readCount, postIp, modifyIp
                            FROM note
                            WHERE isPost = 'Y'
                        ";

            using (var con = _context.CreateConnection())
            {
                var notes = await con.QueryAsync<GetNote>(sql);
                return notes.ToList();
            }
        }

        public async Task<IEnumerable<GetNote>> GetNoteByCategory(string category, string subCategory)
        {
            string ParamSubCategory = "";

            if (!string.IsNullOrEmpty(subCategory)) ParamSubCategory = "AND a.subName = @subCategory";

            string sql = string.Format(@"SELECT *
                            FROM note a
                            WHERE a.name = @category
                            {0}
                            AND IsPost ='Y'
                        ",  ParamSubCategory);

            using (var con = _context.CreateConnection())
            {
                var notes = await con.QueryAsync<GetNote>(sql, new { category, subCategory });
                return notes.ToList();
            }
        }

        public async Task<GetNote> GetNoteById(int id)
        {
            string updataCount = @"UPDATE note SET ReadCount = ReadCount+1 
                                    WHERE noteId =@id ";

            string sql = @"SELECT noteId, title, userId, content, postDate, modifyDate, thumbImage, category, subCategory, readCount, postIp, modifyIp
                            FROM note
                            WHERE NoteId = @id
                            AND IsPost ='Y'
                        ";


            using (var con = _context.CreateConnection()){
                await con.QueryAsync(updataCount, new {id});
                return con.QuerySingleOrDefault<GetNote>(sql, new {id});
            }
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

        public async Task<IEnumerable<CategoryViewModel>> getNoteCategoryList()
        {
            string sql = @"SELECT a.name as category , NVL(b.subName,'') as subCategory
                            FROM category a LEFT OUTER JOIN subcategory b
                            ON a.name = b.name";

            using (var con = _context.CreateConnection())
            {
                var categoryList = await con.QueryAsync<CategoryViewModel>(sql);
                return categoryList;
            }
        }

        public int PostCategory(string Category, string SubCategory)
        {
            _logger.LogInformation("categort: " + Category + " " + "subcategory: " + SubCategory);
            // Category 유무 Check
            string sql = @"SELECT Name FROM category WHERE Name = @Category";
            string insertCategory = @"INSERT INTO category (Name) VALUES (@Category)";
            string insertSubCategory = @"INSERT INTO subcategory (Name, subName) VALUES (@Category ,@SubCategory)";

            using (var con = _context.CreateConnection())
            {
                string isCategoryExist = con.QueryFirstOrDefault<string>(sql, new { Category });
                 _logger.LogInformation("isCategoryExist" + isCategoryExist);
                // Category new create
                if (string.IsNullOrEmpty(isCategoryExist))
                {
                    con.QueryFirstOrDefault<int>(insertCategory, new { Category });
                    if (!string.IsNullOrEmpty(SubCategory)) con.QueryFirstOrDefault(insertSubCategory, new { Category, SubCategory });
                    return 1;
                }
                // Category add  
                else
                {
                    if (!String.IsNullOrEmpty(SubCategory))
                    {
                        con.QueryFirstOrDefault(insertSubCategory, new { Category, SubCategory });
                        return 1;
                    }
                }
                return -1;
            }
        }

        public int PostNote(PostNoteView note, BoardWriteFormType formType)
        {
            var param = new DynamicParameters();
            string sql = "";
            string thumbImageBuff = "";
            string userPasswordSql = @"SELECT password FROM user WHERE userId = @UserId";

            param.Add("@Title", value: note.title, dbType: DbType.String);
            param.Add("@UserId", value: note.userId, dbType: DbType.Int32);
            param.Add("@Content", value: note.content, dbType: DbType.String);
            // param.Add("@IsPost", value: note.isPost, dbType: DbType.String);
            param.Add("@Category", value: note.category, dbType: DbType.String);
            param.Add("@SubCategory", value: note.subCategory, dbType: DbType.String);

            using (var con = _context.CreateConnection())
            {
                string password = con.QueryFirstOrDefault<string>(userPasswordSql, new {UserId = note.userId});

                if (formType == BoardWriteFormType.create)
                {
                    param.Add("@PostIp", value: note.postIp, dbType: DbType.String);
                    param.Add("@Password", value: password, dbType: DbType.String);
                    param.Add("@ThumbImage", value: note.thumbImage, dbType: DbType.String);

                    sql = @"INSERT INTO note (Title, UserId, Content, Password, ThumbImage, IsPost, PostDate, PostIp,  Category, SubCategory, ReadCount)
                        VALUES (@Title, @UserId, @Content, @Password, @ThumbImage, 'Y', Now(), @PostIp, @Category, @SubCategory, 0)";
                }
                else if (formType == BoardWriteFormType.modify)
                {
                    param.Add("@ModifyIp", value: note.modifyIp, dbType: DbType.String);
                    param.Add("@NoteId", value: note.noteId, dbType: DbType.Int32);
                    if (note.thumbImage != null && note.thumbImage.Length > 1)
                    {
                        param.Add("@ThumbImage", value: note.thumbImage, dbType: DbType.String);
                        thumbImageBuff = "ThumbImage = @ThumbImage,";
                    }

                    sql = string.Format(@"UPDATE note
                        SET title = @Title,
                            Content = @Content,
                            Userid = @UserId,
                            {0}
                            ModifyDate = NOW(),
                            ModifyIp = @ModifyIp,
                            Category = @Category,
                            SubCategory = @SubCategory
                        WHERE noteId = @NoteId
                        ", thumbImageBuff);
                }
                con.Execute(sql, param, commandType: CommandType.Text);
                return 1;
            }
        }
    }

    public enum BoardWriteFormType
    {
        create,
        modify
    }
}