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

    #region Snippets

    public async Task<ReqResult<SnippetDTO>> snippetsGet(int taskGroup, int lang1, int lang2) {
        await using (var cmd = new NpgsqlCommand(db.getQueries.snippets, db.conn)) { 
            cmd.Parameters.AddWithValue("l1", NpgsqlTypes.NpgsqlDbType.Integer, lang1);
            cmd.Parameters.AddWithValue("l2", NpgsqlTypes.NpgsqlDbType.Integer, lang2);
            cmd.Parameters.AddWithValue("tgId", NpgsqlTypes.NpgsqlDbType.Integer, taskGroup);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<SnippetDTO>(reader);
            }
        }
    }

    public async Task<ReqResult<SnippetDTO>> snippetsGetByCode(string taskGroup, string lang1, string lang2) {
        await using (var cmd = new NpgsqlCommand(db.getQueries.snippetsByCode, db.conn)) { 
            cmd.Parameters.AddWithValue("l1Code", NpgsqlTypes.NpgsqlDbType.Varchar, lang1);
            cmd.Parameters.AddWithValue("l2Code", NpgsqlTypes.NpgsqlDbType.Varchar, lang2);
            cmd.Parameters.AddWithValue("tgCode", NpgsqlTypes.NpgsqlDbType.Varchar, taskGroup);
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

    public async Task<ReqResult<ProposalDTO>> proposalsGet() {
        await using (var cmd = new NpgsqlCommand(db.getQueries.proposals, db.conn)) { 
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<ProposalDTO>(reader);
            }
        }
    }


    public async Task<int> proposalCreate(CreateProposalDTO dto, int authorId) {
        await using (var cmdTL = new NpgsqlCommand(db.postQueries.taskLanguageCreate, db.conn)) { 
            cmdTL.Parameters.AddWithValue("taskId", NpgsqlTypes.NpgsqlDbType.Integer, dto.taskId);
            cmdTL.Parameters.AddWithValue("langId", NpgsqlTypes.NpgsqlDbType.Integer, dto.langId);
            int tlId = (int)cmdTL.ExecuteScalar();
            await using (var cmdProp = new NpgsqlCommand(db.postQueries.proposalCreate, db.conn)) {
                cmdProp.Parameters.AddWithValue("tlId", NpgsqlTypes.NpgsqlDbType.Integer, tlId);
                cmdProp.Parameters.AddWithValue("content", NpgsqlTypes.NpgsqlDbType.Varchar, dto.content);
                cmdProp.Parameters.AddWithValue("ts", NpgsqlTypes.NpgsqlDbType.TimestampTz, DateTime.Now);
                cmdProp.Parameters.AddWithValue("authorId", NpgsqlTypes.NpgsqlDbType.Integer, authorId);
                return await cmdProp.ExecuteNonQueryAsync();
            }                        
        }
    }

    public async Task<int> snippetApprove(int sn) {
        await using (var cmd = new NpgsqlCommand(db.postQueries.snippetApprove, db.conn)) { 
            cmd.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, sn);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    public async Task<int> snippetDecline(int sn) {
        await using (var cmd = new NpgsqlCommand(db.postQueries.snippetDecline, db.conn)) { 
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

    public async Task<ReqResult<AlternativeDTO>> alternativesForTLGet(int taskLanguageId) {
        await using (var cmd = new NpgsqlCommand(db.getQueries.alternative, db.conn)) { 
            cmd.Parameters.AddWithValue("tlId", NpgsqlTypes.NpgsqlDbType.Integer, taskLanguageId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<AlternativeDTO>(reader);
            }
        }
    }
    #endregion

    #region Admin

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

    public async Task<int> taskGroupCU(TaskGroupCUDTO dto) {
        return await createOrUpdate<TaskGroupCUDTO>(db.postQueries.taskGroupCreate, db.postQueries.taskGroupUpdate, taskGroupParamAdder, dto);
    }   

    public async Task<int> taskCU(TaskCUDTO dto) {
        return await createOrUpdate<TaskCUDTO>(db.postQueries.taskCreate, db.postQueries.taskUpdate, taskParamAdder, dto);
    }

    public async Task<int> languageGroupCU(LanguageGroupCUDTO dto) {
        return await createOrUpdate<LanguageGroupCUDTO>(db.postQueries.languageGroupCreate, db.postQueries.languageGroupUpdate, languageGroupParamAdder, dto);
    }

    public async Task<int> languageCU(LanguageCUDTO dto) {
        return await createOrUpdate<LanguageCUDTO>(db.postQueries.languageCreate, db.postQueries.languageUpdate, languageParamAdder, dto);
    }

    #endregion

    #region Users
    public async Task<ReqResult<AuthenticateIntern>> userAuthentGet(string userName) {
        await using (var cmd = new NpgsqlCommand(db.getQueries.userAuthentData, db.conn)) { 
            cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, userName);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<AuthenticateIntern>(reader);
            }
        }
    }

    public async Task<ReqResult<AuthorizeIntern>> userAuthorGet(int userId) {
        await using (var cmd = new NpgsqlCommand(db.getQueries.userAuthor, db.conn)) { 
            cmd.Parameters.AddWithValue("id", NpgsqlTypes.NpgsqlDbType.Integer, userId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<AuthorizeIntern>(reader);
            }
        }
    }

    public async Task<ReqResult<AuthenticateIntern>> userAdminAuthent(string accessToken) {
        await using (var cmd = new NpgsqlCommand(db.getQueries.userAdminData, db.conn)) { 
            cmd.Parameters.AddWithValue("accessToken", NpgsqlTypes.NpgsqlDbType.Integer, accessToken);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<AuthenticateIntern>(reader);
            }
        }
    }

    public async Task<ReqResult<AuthorizeIntern>> userAdminAuthor() {
        await using (var cmd = new NpgsqlCommand(db.getQueries.userAdminAuthor, db.conn)) { 
            cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, AdminPasswordChecker.adminName);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<AuthorizeIntern>(reader);
            }
        }
    }

    public async Task<int> userUpdateExpiration(int userId, string newToken, DateTime newDate) {
        await using (var cmd = new NpgsqlCommand(db.postQueries.userUpdateExpiration, db.conn)) { 
            cmd.Parameters.AddWithValue("id", NpgsqlTypes.NpgsqlDbType.Integer, userId);
            cmd.Parameters.AddWithValue("newDate", NpgsqlTypes.NpgsqlDbType.Date, newDate);
            cmd.Parameters.AddWithValue("newToken", NpgsqlTypes.NpgsqlDbType.Varchar, newToken);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    public async Task<int> userRegister(string userName, string hash, string salt, string accessToken, DateTime dtExpiration) {
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

    public async Task<ReqResult<CommentDTO>> commentsGet(int snippetId) {
        await using (var cmd = new NpgsqlCommand(db.getQueries.alternative, db.conn)) { 
            cmd.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, snippetId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<CommentDTO>(reader);
            }
        }
    }

    public async Task<ReqResult<StatsDTO>> statsForAdmin() {
        await using (var cmd = new NpgsqlCommand(db.getQueries.statsForAdmin, db.conn)) {             
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<StatsDTO>(reader);
            }
        }
    }

    public async Task<int> userVote(int userId, int tlId, int snId) {
        await using (var cmd = new NpgsqlCommand(db.postQueries.vote, db.conn)) { 
            cmd.Parameters.AddWithValue("userId", NpgsqlTypes.NpgsqlDbType.Integer, userId);
            cmd.Parameters.AddWithValue("tlId", NpgsqlTypes.NpgsqlDbType.Integer, tlId);
            cmd.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, snId);
            return await cmd.ExecuteNonQueryAsync();            
        }
    }

    public async Task<int> commentCreate(int userId, int snId, string content, DateTime ts) {
        await using (var cmd = new NpgsqlCommand(db.postQueries.commentCreate, db.conn)) { 
            cmd.Parameters.AddWithValue("userId", NpgsqlTypes.NpgsqlDbType.Integer, userId);
            cmd.Parameters.AddWithValue("content", NpgsqlTypes.NpgsqlDbType.Varchar, content);
            cmd.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, snId);
            cmd.Parameters.AddWithValue("ts", NpgsqlTypes.NpgsqlDbType.TimestampTz, ts);
            return await cmd.ExecuteNonQueryAsync();            
        }
    }

    #endregion

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

    private async Task<int> createOrUpdate<T>(string urlCreate, string urlUpdate, Action<NpgsqlCommand, T> paramsAdder, T dto) where T: CUDTO {
        if (dto.existingId == null) {
            await using (var cmd = new NpgsqlCommand(urlCreate, db.conn)) { 
                paramsAdder(cmd, dto);
                return await cmd.ExecuteNonQueryAsync();
            }
        } else {
            await using (var cmd = new NpgsqlCommand(urlUpdate, db.conn)) { 
                paramsAdder(cmd, dto);
                cmd.Parameters.AddWithValue("existingId", NpgsqlTypes.NpgsqlDbType.Integer, dto.existingId);
                return await cmd.ExecuteNonQueryAsync();
            }            
        }    
    }

    private static void taskParamAdder(NpgsqlCommand cmd, TaskCUDTO dto) {
        cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, dto.name);
        cmd.Parameters.AddWithValue("description", NpgsqlTypes.NpgsqlDbType.Varchar, dto.description);
        cmd.Parameters.AddWithValue("tgId", NpgsqlTypes.NpgsqlDbType.Integer, dto.tgId);
    }

    private static void taskGroupParamAdder(NpgsqlCommand cmd, TaskGroupCUDTO dto) {
        cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, dto.name);
        cmd.Parameters.AddWithValue("code", NpgsqlTypes.NpgsqlDbType.Varchar, dto.code);
        cmd.Parameters.AddWithValue("isDeleted", NpgsqlTypes.NpgsqlDbType.Bit, dto.isDeleted);
    }

    private static void languageGroupParamAdder(NpgsqlCommand cmd, LanguageGroupCUDTO dto) {
        cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, dto.name);
        cmd.Parameters.AddWithValue("code", NpgsqlTypes.NpgsqlDbType.Varchar, dto.code);
        cmd.Parameters.AddWithValue("sortingOrder", NpgsqlTypes.NpgsqlDbType.Integer, dto.sortingOrder);
    }

    private static void languageParamAdder(NpgsqlCommand cmd, LanguageCUDTO dto) {
        cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, dto.name);
        cmd.Parameters.AddWithValue("code", NpgsqlTypes.NpgsqlDbType.Varchar, dto.code);
        cmd.Parameters.AddWithValue("lgId", NpgsqlTypes.NpgsqlDbType.Integer, dto.lgId);
        cmd.Parameters.AddWithValue("isDeleted", NpgsqlTypes.NpgsqlDbType.Bit, dto.isDeleted);
    }
}

}