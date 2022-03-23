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
                return con.Execute(sql, new {id = id});
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
                var count = await con.QuerySingleAsync<int>(sql);
                return count;
            }
        }

        public async Task<IEnumerable<Note>> GetNoteAll()
        {
            string sql = @"SELECT *
                            FROM note
                            WHERE isPost = 'Y'
                        ";

            using (var con = _context.CreateConnection())
            {
                var notes = await con.QueryAsync<Note>(sql);
                return notes.ToList();
            }
        }

        public async Task<IEnumerable<Note>> GetNoteByCategory(string category, string subCategory = "")
        {
            string sql = @"SELECT *
                            FROM note a
                            WHERE a.CategoryId IN (
                                SELECT b.CategoryId
                                FROM category b, subcategory c
                                WHERE b.CategoryId = c.CategoryId
                                AND b.Name = @category
                                AND c.Name = @subCategory
                            )
                            AND IsPost ='Y'
                        ";

            using (var con = _context.CreateConnection())
            {
                var notes = await con.QueryAsync<Note>(sql, new { category, subCategory });
                return notes.ToList();
            }
        }

        public Note GetNoteById(int id)
        {
            string sql = @"SELECT *
                            FROM note
                            WHERE NoteId = @id
                            AND IsPost ='Y'
                        ";

            var con = _context.CreateConnection();
            return con.QuerySingleOrDefault<Note>(sql, new { id });
        }

        public async Task<IEnumerable<Note>> GetNoteBySearch(string searchQuery)
        {
            string sql = @"SELECT *
                            FROM note
                            WHERE Title LIKE @searchQuery
                            OR Content LIKE @searchQuery
                            AND IsPost ='Y'
                          ";

            using (var con = _context.CreateConnection())
            {
                var notes = await con.QueryAsync<Note>(sql, new { searchQuery = "%" + searchQuery + "%" });
                return notes.ToList();
            }
        }

        public int PostNote(Note note, BoardWriteFormType formType)
        {
            int result = 0;
            var param = new DynamicParameters();
            string sql ="";

            param.Add("@Title", value: note.Title, dbType: DbType.String);
            param.Add("@UserId", value: note.UserId, dbType: DbType.Int32);
            param.Add("@Content", value: note.Content, dbType: DbType.String);
            param.Add("@Password", value: note.Password, dbType: DbType.String);
            param.Add("@ThumbImage", value: note.ThumbImage, dbType: DbType.String);
            param.Add("@IsPost", value: note.ThumbImage, dbType: DbType.String);
            param.Add("@CategoryId", value: note.ThumbImage, dbType: DbType.String);

            if (formType == BoardWriteFormType.create)
            {
                param.Add("@PostIp", value: note.PostIp, dbType: DbType.String);

                sql = @"INSERT INTO note (Title, UserId, Content, Password, ThumbImage, IsPost, PostDate, PostIp, CategoryId)
                        VALUES (@Title, @UserId, @Content, @Password, @ThumbImage, @IsPost, Now(), @PostIp, @CategoryId)";
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

            using(var con = _context.CreateConnection()){
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