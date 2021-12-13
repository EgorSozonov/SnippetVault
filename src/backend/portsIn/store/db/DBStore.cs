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
        await using (var cmd = new NpgsqlCommand(db.getQueries.snippets, db.conn)) { 
            cmd.Parameters.AddWithValue("l1", NpgsqlTypes.NpgsqlDbType.Integer, lang1);
            cmd.Parameters.AddWithValue("l2", NpgsqlTypes.NpgsqlDbType.Integer, lang2);
            cmd.Parameters.AddWithValue("tgId", NpgsqlTypes.NpgsqlDbType.Integer, taskGroup);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<SnippetDTO>(reader);
            }
        }
    }

    public async Task<ReqResult<BareSnippetDTO>> snippetGet(int snId) {
        await using (var cmd = new NpgsqlCommand(db.getQueries.snippet, db.conn)) { 
            cmd.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, snId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<BareSnippetDTO>(reader);
            }
        }
    }

    public async Task<ReqResult<LanguageGroupedDTO>> languagesGetGrouped() {
        await using (var cmd = new NpgsqlCommand(db.getQueries.languagesGrouped, db.conn)) { 
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<LanguageGroupedDTO>(reader);
            }
        }
    }

    public async Task<ReqResult<LanguageDTO>> languagesGet() {
        await using (var cmd = new NpgsqlCommand(db.getQueries.languages, db.conn)) { 
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
        await using (var cmd = new NpgsqlCommand(db.getQueries.proposals, db.conn)) { 
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<ProposalDTO>(reader);
            }
        }
    }

    public async Task<ReqResult<TaskDTO>> tasksFromGroupGet(int taskGroup) {
        await using (var cmd = new NpgsqlCommand(db.getQueries.task, db.conn)) { 
            cmd.Parameters.AddWithValue("tgId", NpgsqlTypes.NpgsqlDbType.Integer, taskGroup);
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
            cmd.Parameters.AddWithValue("tlId", NpgsqlTypes.NpgsqlDbType.Integer, taskLanguageId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<AlternativeDTO>(reader);
            }
        }
    }

    public async Task<ReqResult<CommentDTO>> commentsGet(int snippetId) {
        await using (var cmd = new NpgsqlCommand(db.getQueries.alternative, db.conn)) { 
            cmd.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, snippetId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<CommentDTO>(reader);
            }
        }
    }

    public async Task<int> proposalCreate(CreateProposalDTO dto) {
        await using (var cmdTL = new NpgsqlCommand(db.postQueries.taskLanguageCreate, db.conn)) { 
            cmdTL.Parameters.AddWithValue("taskId", NpgsqlTypes.NpgsqlDbType.Integer, dto.taskId);
            cmdTL.Parameters.AddWithValue("langId", NpgsqlTypes.NpgsqlDbType.Integer, dto.langId);
            int tlId = (int)cmdTL.ExecuteScalar();
            await using (var cmdProp = new NpgsqlCommand(db.postQueries.proposalCreate, db.conn)) {
                cmdProp.Parameters.AddWithValue("tlId", NpgsqlTypes.NpgsqlDbType.Integer, tlId);
                cmdProp.Parameters.AddWithValue("content", NpgsqlTypes.NpgsqlDbType.Varchar, dto.content);
                cmdProp.Parameters.AddWithValue("ts", NpgsqlTypes.NpgsqlDbType.TimestampTz, DateTime.Now);
                return await cmdProp.ExecuteNonQueryAsync();
            }                        
        }
    }

    public async Task<int> snippetApprove(int sn) {
        await using (var cmd = new NpgsqlCommand(db.postQueries.approveProposal, db.conn)) { 
            cmd.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, sn);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    public async Task<int> snippetDelete(int sn) {
        await using (var cmd = new NpgsqlCommand(db.postQueries.deleteSnippet, db.conn)) { 
            cmd.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, sn);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    public async Task<int> snippetMarkPrimary(int tlId, int snId) {
        await using (var cmd = new NpgsqlCommand(db.postQueries.markPrimarySnippet, db.conn)) { 
            cmd.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, snId);
            cmd.Parameters.AddWithValue("tlId", NpgsqlTypes.NpgsqlDbType.Integer, tlId);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    public async Task<int> taskGroupInsert(TaskGroupDTO dto) {
        await using (var cmd = new NpgsqlCommand(db.postQueries.addTaskGroup, db.conn)) { 
            cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, dto.name);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    public async Task<int> taskInsert(TaskDTO dto) {
        await using (var cmd = new NpgsqlCommand(db.postQueries.addTask, db.conn)) { 
            cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, dto.name);
            cmd.Parameters.AddWithValue("description", NpgsqlTypes.NpgsqlDbType.Varchar, dto.description);
            cmd.Parameters.AddWithValue("tgId", NpgsqlTypes.NpgsqlDbType.Integer, dto.tgId);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    public async Task<int> languageGroupInsert(LanguageGroupDTO dto) {
        await using (var cmd = new NpgsqlCommand(db.postQueries.addLanguageGroup, db.conn)) { 
            cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, dto.name);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    public async Task<int> languageInsert(LanguageDTO dto) {
        await using (var cmd = new NpgsqlCommand(db.postQueries.addLanguage, db.conn)) { 
            cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, dto.name);
            cmd.Parameters.AddWithValue("lgId", NpgsqlTypes.NpgsqlDbType.Integer, dto.lgId);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    public async Task<ReqResult<UserCredsDTO>> userCredsGet(string userName) {
        await using (var cmd = new NpgsqlCommand(db.getQueries.userCreds, db.conn)) { 
            cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, userName);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<UserCredsDTO>(reader);
            }
        }
    }

    public async Task<int> userRegister(string userName, string hash, string salt, string accessToken, DateTime dtExpiration) {
        //@name, @hash, @salt, @accessToken, @expirationTs
        await using (var cmd = new NpgsqlCommand(db.postQueries.userRegister, db.conn)) { 
            cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, userName);
            cmd.Parameters.AddWithValue("salt", NpgsqlTypes.NpgsqlDbType.Varchar, salt);
            cmd.Parameters.AddWithValue("hash", NpgsqlTypes.NpgsqlDbType.Varchar, hash);
            cmd.Parameters.AddWithValue("accessToken", NpgsqlTypes.NpgsqlDbType.Varchar, accessToken);
            cmd.Parameters.AddWithValue("tsJoin", NpgsqlTypes.NpgsqlDbType.TimestampTz, DateTime.Now);
            cmd.Parameters.AddWithValue("dtExpiration", NpgsqlTypes.NpgsqlDbType.Date, dtExpiration);
            var mbNewInt = cmd.ExecuteScalar();
            return mbNewInt != null ? (int)mbNewInt : 0;
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