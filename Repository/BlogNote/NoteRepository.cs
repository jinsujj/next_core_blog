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

        public async Task<IEnumerable<GetNote>> GetNoteAll(int userId)
        {
            string sql = @"SELECT noteId, title, userId, content, postDate, modifyDate, thumbImage, category, subCategory, readCount, postIp, modifyIp, isPost
                            FROM note
                            WHERE isPost = 'Y'
                            OR (userId = @UserId AND isPost ='N')
                        ";

            using (var con = _context.CreateConnection())
            {
                var notes = await con.QueryAsync<GetNote>(sql, new {UserId = userId});
                return notes.ToList();
            }
        }

        public async Task<IEnumerable<GetNote>> GetNoteByCategory(int userId, string category, string subCategory)
        {
            string ParamSubCategory = "";

            if (!string.IsNullOrEmpty(subCategory) && subCategory.Length >1) 
                ParamSubCategory = "AND a.subcategory = @subCategory";

            string sql = string.Format(@"SELECT *
                            FROM note a
                            WHERE a.category = @category
                            {0}
                            AND (IsPost ='Y' OR (userId = @userId AND IsPost ='N'))
                        ",  ParamSubCategory);

            using (var con = _context.CreateConnection())
            {
                var notes = await con.QueryAsync<GetNote>(sql, new { category, subCategory, userId });
                return notes.ToList();
            }
        }

        public async Task<GetNote> GetNoteById(int id, int userId, string ip)
        {
            string updataCount = @"UPDATE note SET ReadCount = ReadCount+1 
                                    WHERE noteId =@id 
                                    AND isPost ='Y'";

            string sql = @"SELECT noteId, title, userId, content, postDate, modifyDate, thumbImage, category, subCategory, readCount, postIp, modifyIp
                            FROM note
                            WHERE NoteId = @id
                            AND (IsPost ='Y' OR (userId = @userId AND IsPost ='N'))
                        ";


            using (var con = _context.CreateConnection()){
                await con.QueryAsync(updataCount, new {id});
                return con.QuerySingleOrDefault<GetNote>(sql, new {id, userId});
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

        public async Task<IEnumerable<SidebarCategoryViewModel>> GetSidebarCategoryList()
        {
           string sql = @"SELECT a.Name, a.Count as MainCount, b.subName, b.Count as SubCount
                            FROM category a left OUTER JOIN subcategory b
                            ON a.Name = b.name";

            using (var con = _context.CreateConnection()){
                var categoryList = await con.QueryAsync<SidebarCategoryViewModel>(sql);
                 return categoryList;
            }
        }


        public int PostCategory(string Category, string SubCategory)
        {
            _logger.LogInformation("categort: " + Category + " " + "subcategory: " + SubCategory);
            // Category 유무 Check
            string sql = @"SELECT Name FROM category WHERE Name = @Category";
            string insertCategory = @"INSERT INTO category (Name, Count) VALUES (@Category, 0)";
            string insertSubCategory = @"INSERT INTO subcategory (Name, subName, Count) VALUES (@Category ,@SubCategory, 0)";

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
            string userPasswordSql = @"SELECT password FROM user WHERE userId = @UserId";
            string postNotesql = "";
            string categoryUpdateSql ="";
            string subCategoryUpdateSql ="";
            string thumbImageBuff = "";

            param.Add("@Title", value: note.title, dbType: DbType.String);
            param.Add("@UserId", value: note.userId, dbType: DbType.Int32);
            param.Add("@Content", value: note.content, dbType: DbType.String);
            param.Add("@Category", value: note.category, dbType: DbType.String);
            param.Add("@SubCategory", value: note.subCategory, dbType: DbType.String);
            param.Add("@IsPost", value: note.isPost, dbType: DbType.String);

            using (var con = _context.CreateConnection())
            {
                string password = con.QueryFirstOrDefault<string>(userPasswordSql, new {UserId = note.userId});

                if (formType == BoardWriteFormType.create)
                {
                    param.Add("@PostIp", value: note.postIp, dbType: DbType.String);
                    param.Add("@Password", value: password, dbType: DbType.String);
                    param.Add("@ThumbImage", value: note.thumbImage, dbType: DbType.String);

                    // Insert Note
                    postNotesql = @"INSERT INTO note (Title, UserId, Content, Password, ThumbImage, IsPost, PostDate, PostIp, Category, SubCategory, ReadCount)
                        VALUES (@Title, @UserId, @Content, @Password, @ThumbImage, @IsPost, Now(), @PostIp, @Category, @SubCategory, 0)";


                    // Update Category
                    categoryUpdateSql = @"UPDATE category SET Count = Count + 1 WHERE name = @Category";
                    subCategoryUpdateSql = @"UPDATE subcategory SET Count = Count +1
                                             WHERE Name = @Category
                                             AND subName = @SubCategory;
                                             ";

                    con.Execute(categoryUpdateSql, new {Category = note.category});
                    con.Execute(subCategoryUpdateSql, new {Category = note.category , SubCategory = note.subCategory});
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

                    // Select Note 
                    string noteSql = @"SELECT noteID, title, userId, category, subCategory 
                                        FROM note
                                        WHERE noteId = @id
                                        AND (IsPost ='Y' OR (userId = @userId AND IsPost ='N'))";
                    var noteInfo = con.QuerySingleOrDefault<GetNote>(noteSql, new {userId = note.userId,  id = note.noteId});

                    // Update Category
                    if(noteInfo.Category != note.category){
                        categoryUpdateSql = @"UPDATE category SET Count = Count + 1 WHERE name = @Category";
                        con.Execute(categoryUpdateSql, new {Category = note.category});
                        categoryUpdateSql = @"UPDATE category SET Count = Count -1 WHERE name = @Category";
                        con.Execute(categoryUpdateSql, new {Category = noteInfo.Category});
                    }
                    if(noteInfo.SubCategory != note.subCategory && note.subCategory.Length >0 ){
                        subCategoryUpdateSql = @"UPDATE subcategory SET Count = Count +1 
                                                 WHERE name = @Category
                                                 AND subName = @SubCategory";
                        con.Execute(subCategoryUpdateSql, new {Category = note.category , SubCategory = note.subCategory});
                        subCategoryUpdateSql = @"UPDATE subcategory SET Count = Count -1 
                                                 WHERE name = @Category
                                                 AND subName = @SubCategory";
                        con.Execute(subCategoryUpdateSql, new {Category = noteInfo.Category, SubCategory = noteInfo.SubCategory});                                                
                    }
                    if(noteInfo.SubCategory.Length >0 && note.subCategory.Length == 0)
                    {
                        subCategoryUpdateSql = @"UPDATE subcategory SET Count = Count - 1 
                                                 WHERE name = @Category
                                                 AND subName = @SubCategory";
                        con.Execute(subCategoryUpdateSql, new { Category = noteInfo.Category, SubCategory = noteInfo.SubCategory });
                    }

                    // Update Note
                    postNotesql = string.Format(@"UPDATE note
                        SET title = @Title,
                            Content = @Content,
                            Userid = @UserId,
                            {0}
                            ModifyDate = NOW(),
                            ModifyIp = @ModifyIp,
                            Category = @Category,
                            SubCategory = @SubCategory,
                            IsPost = @IsPost
                        WHERE noteId = @NoteId
                        ", thumbImageBuff);
                }
                con.Execute(postNotesql, param, commandType: CommandType.Text);
                return 1;
            }
        }

        public async Task<int> getTotalReadCount()
        {
            string sql = @"SELECT SUM(readCount) FROM note";

            using (var con = _context.CreateConnection()){
                int count = await con.QueryFirstOrDefaultAsync<int>(sql);
                return count;
            }
        }

        public async Task<int> getTodayReadCount()
        {
            string sql = @"SELECT COUNT(*)
                            FROM userlog
                            Where date_format(Date,'%Y%m%d') = date_format(NOW(),'%Y%m%d')";
            
            using (var con  = _context.CreateConnection()){
                 int count = await con.QueryFirstOrDefaultAsync<int>(sql);
                return count;
            }
        }

        public async Task<int> postIpLog(IpLogModel logModel){
            string Content = string.Format("page {0}",logModel._id);
            string sql = "SELECT COUNT(*) FROM note WHERE noteId= @id AND isPost ='Y'";
            using (var con = _context.CreateConnection())
            {
                int isPosted = con.QueryFirstOrDefault<int>(sql, new {id = logModel._id});
                if(isPosted == 1){
                    await con.QueryAsync(@"INSERT INTO userlog SET Content= @Content, Ip = @Ip, Date =NOW()", new { Content, Ip = logModel._ip });    
                }
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