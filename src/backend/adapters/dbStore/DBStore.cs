namespace SnippetVault {
using System;
using System.Threading.Tasks;
using Npgsql;


public class DBStore : IStore {   
    private GetQueries getQueries {get;}
    private PostQueries postQueries {get;}
    private NpgsqlConnection conn {get;}
    private readonly IDBContext db;

    public DBStore(IDBContext _db) {
        this.db = _db;
    }

    public async Task<ReqResult<SnippetDTO>> snippetsGet(int lang1, int lang2, int taskGroup) {
        await using (var cmd = new NpgsqlCommand(db.getQueries.snippet, db.conn)) { 
            cmd.Parameters.AddWithValue("l1", NpgsqlTypes.NpgsqlDbType.Integer, lang1);
            cmd.Parameters.AddWithValue("l2", NpgsqlTypes.NpgsqlDbType.Integer, lang2);
            cmd.Parameters.AddWithValue("tg", NpgsqlTypes.NpgsqlDbType.Integer, taskGroup);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<SnippetDTO>(reader);
            }
        }
    }

    public async Task<ReqResult<LanguageDTO>> languagesGet() {
        await using (var cmd = new NpgsqlCommand(db.getQueries.language, db.conn)) { 
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<LanguageDTO>(reader);
            }
        }
    }

    public async Task<ReqResult<TaskGroupDTO>> taskGroupsGet() {
        await using (var cmd = new NpgsqlCommand(db.getQueries.taskGroup, db.conn)) { 
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<TaskGroupDTO>(reader);
            }
        }
    }
    public async Task<ReqResult<ProposalDTO>> proposalsGet() {
        await using (var cmd = new NpgsqlCommand(db.getQueries.proposal, db.conn)) { 
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<ProposalDTO>(reader);
            }
        }
    }

    public async Task<ReqResult<TaskDTO>> tasksFromGroupGet(int taskGroup) {
        await using (var cmd = new NpgsqlCommand(db.getQueries.task, db.conn)) { 
            cmd.Parameters.AddWithValue("tg", NpgsqlTypes.NpgsqlDbType.Integer, taskGroup);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<TaskDTO>(reader);
            }
        }
    }

    public async Task<ReqResult<TaskGroupDTO>> taskGroupsForLangGet(int langId) {
        return await taskGroupsForArrayLanguages(new int[] {langId});
    }

    public async Task<ReqResult<TaskGroupDTO>> taskGroupsForLangsGet(int lang1, int lang2) {
        return await taskGroupsForArrayLanguages(new int[] {lang1, lang2});

    }

    public async Task<ReqResult<AlternativeDTO>> alternativesForTLGet(int taskLanguageId) {
        await using (var cmd = new NpgsqlCommand(db.getQueries.alternative, db.conn)) { 
            cmd.Parameters.AddWithValue("tl", NpgsqlTypes.NpgsqlDbType.Integer, taskLanguageId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<AlternativeDTO>(reader);
            }
        }
    }

    public async Task<ReqResult<CommentDTO>> commentsGet(int snippetId) {
        await using (var cmd = new NpgsqlCommand(db.getQueries.alternative, db.conn)) { 
            cmd.Parameters.AddWithValue("sn", NpgsqlTypes.NpgsqlDbType.Integer, snippetId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<CommentDTO>(reader);
            }
        }
    }

    public async Task<int> snippetAdd(CreateSnippetDTO dto) {
        await using (var cmd = new NpgsqlCommand(db.postQueries.addSnippet, db.conn)) { 
            cmd.Parameters.AddWithValue("tl", NpgsqlTypes.NpgsqlDbType.Integer, dto.taskLanguageId);
            cmd.Parameters.AddWithValue("content", NpgsqlTypes.NpgsqlDbType.Varchar, dto.content);
            cmd.Parameters.AddWithValue("ts", NpgsqlTypes.NpgsqlDbType.TimestampTz, DateTime.Now);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    private async Task<ReqResult<TaskGroupDTO>> taskGroupsForArrayLanguages(int[] langs) {        
        await using (var cmd = new NpgsqlCommand(db.getQueries.taskGroupsForLanguages, db.conn)) { 
            cmd.Parameters.AddWithValue("ls", NpgsqlTypes.NpgsqlDbType.Array|NpgsqlTypes.NpgsqlDbType.Integer, langs);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<TaskGroupDTO>(reader);
            }
        }
    }

    private static ReqResult<T> readResultSet<T>(NpgsqlDataReader reader) where T : class, new() {
        try {                    
            string[] columnNames = new string[reader.FieldCount];
            for (int i = 0; i < reader.FieldCount; ++i) {
                columnNames[i] = reader.GetName(i);
            }
            var readerSnippet = new DBDeserializer<T>(columnNames);
            if (!readerSnippet.isOK)  {
                return new Err<T>("Error");
            }

            var results = readerSnippet.readResults(reader, out string errMsg);
            if (errMsg != "") return new Err<T>(errMsg);
            return new Success<T>(results);           
        } catch (Exception e) {
            Console.WriteLine(e.Message);
            return new Err<T>("Exception");
        }  
    }
}



}