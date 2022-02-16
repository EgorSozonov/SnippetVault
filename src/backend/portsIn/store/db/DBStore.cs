namespace SnippetVault {
using System;
using System.Threading.Tasks;
using Npgsql;


public class DBStore : IStore {
    private readonly IDBContext db;

    public DBStore(IDBContext _db) {
        this.db = _db;
    }

    #region Snippets
    private static readonly string snippetsQ = @"
        SELECT sn1.id as ""leftId"", sn1.content as ""leftCode"", tl1.id AS ""leftTlId"", sn1.libraries as ""leftLibraries"",
               t.id AS ""taskId"", t.name AS ""taskName"",
		       sn2.id AS ""rightId"", sn2.content AS ""rightCode"", tl2.id AS ""rightTlId"", sn2.libraries as ""rightLibraries""
		FROM sv.""task"" AS t
		LEFT JOIN sv.""taskLanguage"" tl1 ON tl1.""taskId""=t.id AND tl1.""languageId""=@l1
		LEFT JOIN sv.""taskLanguage"" tl2 ON tl2.""taskId""=t.id AND tl2.""languageId""=@l2
		LEFT JOIN sv.language l1 ON l1.id=tl1.""languageId""
		LEFT JOIN sv.language l2 ON l2.id=tl2.""languageId""
		LEFT JOIN sv.snippet sn1 ON sn1.id=tl1.""primarySnippetId""
		LEFT JOIN sv.snippet sn2 ON sn2.id=tl2.""primarySnippetId""
		WHERE t.""taskGroupId""=@tgId AND t.""isDeleted""=0::bit;";
    public async Task<ReqResult<SnippetDTO>> snippetsGet(int taskGroup, int lang1, int lang2) {
        await using (var cmd = new NpgsqlCommand(snippetsQ, db.conn)) {
            cmd.Parameters.AddWithValue("l1", NpgsqlTypes.NpgsqlDbType.Integer, lang1);
            cmd.Parameters.AddWithValue("l2", NpgsqlTypes.NpgsqlDbType.Integer, lang2);
            cmd.Parameters.AddWithValue("tgId", NpgsqlTypes.NpgsqlDbType.Integer, taskGroup);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<SnippetDTO>(reader);
            }
        }
    }

    private static readonly string snippetsGetByCodeQ = @"
        WITH taskLangs1 AS (
        	SELECT tl.id, tl.""taskId"", l.id AS ""languageId"", ""primarySnippetId""
        	FROM sv.""taskLanguage"" tl
        	JOIN sv.language l ON l.id=tl.""languageId""
        	WHERE code=@l1Code
        ),
        taskLangs2 AS (
        	SELECT tl.id, tl.""taskId"", l.id AS ""languageId"", ""primarySnippetId""
        	FROM sv.""taskLanguage"" tl
        	JOIN sv.language l ON l.id=tl.""languageId""
        	WHERE code=@l2Code
        )
        SELECT sn1.id as ""leftId"", sn1.content as ""leftCode"", tl1.id AS ""leftTlId"", sn1.libraries as ""leftLibraries"",
        	   t.id AS ""taskId"", t.name AS ""taskName"",
        	   sn2.id AS ""rightId"", sn2.content AS ""rightCode"", tl2.id AS ""rightTlId"", sn2.libraries as ""rightLibraries""
        FROM sv.""task"" AS t
        JOIN sv.""taskGroup"" tg ON tg.id=t.""taskGroupId"" AND tg.code=@tgCode
        LEFT JOIN taskLangs1 tl1 ON tl1.""taskId""=t.id
        LEFT JOIN taskLangs2 tl2 ON tl2.""taskId""=t.id
        LEFT JOIN sv.snippet sn1 ON sn1.id=tl1.""primarySnippetId""
        LEFT JOIN sv.snippet sn2 ON sn2.id=tl2.""primarySnippetId""
        WHERE t.""isDeleted""=0::bit;";
    public async Task<ReqResult<SnippetDTO>> snippetsGetByCode(string taskGroup, string lang1, string lang2) {
        await using (var cmd = new NpgsqlCommand(snippetsGetByCodeQ, db.conn)) {
            cmd.Parameters.AddWithValue("l1Code", NpgsqlTypes.NpgsqlDbType.Varchar, lang1);
            cmd.Parameters.AddWithValue("l2Code", NpgsqlTypes.NpgsqlDbType.Varchar, lang2);
            cmd.Parameters.AddWithValue("tgCode", NpgsqlTypes.NpgsqlDbType.Varchar, taskGroup);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<SnippetDTO>(reader);
            }
        }
    }

    private static readonly string snippetGetQ = @"
        SELECT ""taskLanguageId"", ""status"", content, score, libraries
		FROM sv.snippet s
		WHERE id = @snId;
    ";
    public async Task<ReqResult<SnippetIntern>> snippetGet(int snId) {
        await using (var cmd = new NpgsqlCommand(snippetGetQ, db.conn)) {
            cmd.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, snId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<SnippetIntern>(reader);
            }
        }
    }

    private static readonly string proposalsGetQ = @"
        SELECT lang.name AS ""languageName"", task.name AS ""taskName"",
			   sn.id AS ""proposalId"", sn.content, sn.""tsUpload"", u.name AS author, u.id AS ""authorId""
		FROM sv.snippet sn
		JOIN sv.""taskLanguage"" tl ON tl.id=sn.""taskLanguageId""
		JOIN sv.task task ON task.id=tl.""taskId""
		JOIN sv.language lang ON lang.id=tl.""languageId""
        JOIN sv.user u ON u.id=sn.""authorId""
		WHERE sn.status=1 AND lang.""isDeleted""=0::bit AND task.""isDeleted""=0::bit;
    ";
    public async Task<ReqResult<ProposalDTO>> proposalsGet() {
        await using (var cmd = new NpgsqlCommand(proposalsGetQ, db.conn)) {
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<ProposalDTO>(reader);
            }
        }
    }

    private static readonly string taskLanguageCreateQ = @"
        INSERT INTO sv.""taskLanguage""(""taskId"", ""languageId"", ""primarySnippetId"")
        VALUES (@taskId, @langId, NULL)
        ON CONFLICT (""taskId"", ""languageId"") DO UPDATE SET ""languageId""=@langId
        RETURNING id;
    ";
    private static readonly string proposalCreateQ = @"
        INSERT INTO sv.snippet(""taskLanguageId"", content, status, score, libraries, ""tsUpload"", ""authorId"")
        VALUES (@tlId, @content, 1, 0, @libraries, @ts, @authorId);
    ";
    public async Task<int> proposalCreate(ProposalCreateDTO dto, int authorId) {
        await using (var cmdTL = new NpgsqlCommand(taskLanguageCreateQ, db.conn)) {
            cmdTL.Parameters.AddWithValue("taskId", NpgsqlTypes.NpgsqlDbType.Integer, dto.taskId);
            cmdTL.Parameters.AddWithValue("langId", NpgsqlTypes.NpgsqlDbType.Integer, dto.langId);
            int tlId = (int)cmdTL.ExecuteScalar();
            await using (var cmdProp = new NpgsqlCommand(proposalCreateQ, db.conn)) {
                cmdProp.Parameters.AddWithValue("tlId", NpgsqlTypes.NpgsqlDbType.Integer, tlId);
                cmdProp.Parameters.AddWithValue("content", NpgsqlTypes.NpgsqlDbType.Varchar, dto.content);
                cmdProp.Parameters.AddWithValue("libraries", NpgsqlTypes.NpgsqlDbType.Varchar, dto.libraries != null ? dto.libraries : DBNull.Value);
                cmdProp.Parameters.AddWithValue("ts", NpgsqlTypes.NpgsqlDbType.TimestampTz, DateTime.Now.ToUniversalTime());
                cmdProp.Parameters.AddWithValue("authorId", NpgsqlTypes.NpgsqlDbType.Integer, authorId);
                return await cmdProp.ExecuteNonQueryAsync();
            }
        }
    }

    private static readonly string proposalUpdateQ = @"
        UPDATE sv.snippet SET content = @content, libraries = @libraries
        WHERE id = @snId;
    ";
    public async Task<int> proposalUpdate(ProposalUpdateDTO dto) {
        var newLibraries = dto.libraries != null && dto.libraries.Length > 0 ? dto.libraries : null;
        await using (var cmdProp = new NpgsqlCommand(proposalUpdateQ, db.conn)) {
                cmdProp.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, dto.existingId);
                cmdProp.Parameters.AddWithValue("content", NpgsqlTypes.NpgsqlDbType.Varchar, dto.content);
                if (newLibraries != null) {
                    cmdProp.Parameters.AddWithValue("libraries", NpgsqlTypes.NpgsqlDbType.Varchar, newLibraries);
                } else {
                    cmdProp.Parameters.AddWithValue("libraries", NpgsqlTypes.NpgsqlDbType.Varchar, DBNull.Value);
                }
                return await cmdProp.ExecuteNonQueryAsync();
        }
    }

    private static readonly string snippetApproveQ = @"
        BEGIN;

        UPDATE sv.""taskLanguage"" AS tl
        SET ""primarySnippetId"" = @snId
        FROM sv.snippet AS sn
        WHERE sn.""taskLanguageId"" = tl.id AND sn.id = @snId AND tl.""primarySnippetId"" IS NULL;

        UPDATE sv.snippet SET status = 3 WHERE id = @snId;

        COMMIT;
    ";
    public async Task<int> snippetApprove(int sn) {
        await using (var cmd = new NpgsqlCommand(snippetApproveQ, db.conn)) {
            cmd.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, sn);
            return await cmd.ExecuteNonQueryAsync();
        }
    }


    private static readonly string snippetDeclineQ = @"
        UPDATE sv.snippet SET status=2 WHERE id = @snId;
    ";
    public async Task<int> snippetDecline(int sn) {
        await using (var cmd = new NpgsqlCommand(snippetDeclineQ, db.conn)) {
            cmd.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, sn);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    private static readonly string snippetMarkPrimaryQ = @"
        UPDATE sv.""taskLanguage"" SET ""primarySnippetId"" = @snId WHERE id=@tlId AND ""isDeleted""=0::bit;
    ";
    public async Task<int> snippetMarkPrimary(int tlId, int snId) {
        await using (var cmd = new NpgsqlCommand(snippetMarkPrimaryQ, db.conn)) {
            cmd.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, snId);
            cmd.Parameters.AddWithValue("tlId", NpgsqlTypes.NpgsqlDbType.Integer, tlId);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    private static readonly string alternativesForTLGetQ = @"
        SELECT sn.id, sn.content AS content, sn.""tsUpload"", sn.score, COUNT(c.id) AS ""commentCount""
        FROM sv.""taskLanguage"" tl
        JOIN sv.snippet sn ON sn.id=tl.""primarySnippetId""
        LEFT JOIN sv.comment c ON c.""snippetId"" = sn.id
        WHERE tl.id=@tlId
        GROUP BY sn.id, sn.content, sn.""tsUpload"", sn.score

        UNION ALL

        SELECT sn.id, sn.content, sn.""tsUpload"", sn.score, COUNT(c.id) AS ""commentCount""
        FROM sv.snippet sn
        LEFT JOIN sv.comment c ON c.""snippetId"" = sn.id
        WHERE sn.""taskLanguageId"" = @tlId AND sn.status = 3
        GROUP BY sn.id, sn.content, sn.""tsUpload"", sn.score;
    ";
    public async Task<ReqResult<AlternativeDTO>> alternativesForTLGet(int taskLanguageId) {
        await using (var cmd = new NpgsqlCommand(alternativesForTLGetQ, db.conn)) {
            cmd.Parameters.AddWithValue("tlId", NpgsqlTypes.NpgsqlDbType.Integer, taskLanguageId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<AlternativeDTO>(reader);
            }
        }
    }

    private static readonly string alternativesForUserGetQ = @"
        SELECT sn.id, sn.content, sn.""tsUpload"", sn.score, COUNT(c.id) AS ""commentCount"",
               (CASE WHEN uv.""snippetId"" IS NULL THEN FALSE ELSE TRUE END) AS ""voteFlag""
        FROM sv.""taskLanguage"" tl
        JOIN sv.snippet sn ON sn.id=tl.""primarySnippetId""
        LEFT JOIN sv.""userVote"" uv ON uv.""userId"" = @userId AND uv.""snippetId""=sn.id
        LEFT JOIN sv.comment c ON c.""snippetId"" = sn.id
        WHERE tl.id = @tlId
        GROUP BY sn.id, sn.content, sn.""tsUpload"", sn.score, ""voteFlag""

        UNION ALL

        SELECT sn.id, sn.content, sn.""tsUpload"", sn.score, COUNT(c.id) AS ""commentCount"",
               (CASE WHEN uv.""snippetId"" IS NULL THEN FALSE ELSE TRUE END) AS ""voteFlag""
        FROM sv.snippet sn
        LEFT JOIN sv.comment c ON c.""snippetId"" = sn.id
        LEFT JOIN sv.""userVote"" uv ON uv.""userId"" = @userId AND uv.""snippetId"" = sn.id
        WHERE sn.""taskLanguageId""=@tlId AND sn.status = 3
        GROUP BY sn.id, sn.content, sn.""tsUpload"", sn.score, ""voteFlag"";
    ";
    public async Task<ReqResult<AlternativeDTO>> alternativesForUserGet(int taskLanguageId, int userId) {
        await using (var cmd = new NpgsqlCommand(alternativesForUserGetQ, db.conn)) {
            cmd.Parameters.AddWithValue("tlId", NpgsqlTypes.NpgsqlDbType.Integer, taskLanguageId);
            cmd.Parameters.AddWithValue("userId", NpgsqlTypes.NpgsqlDbType.Integer, userId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<AlternativeDTO>(reader);
            }
        }
    }
    #endregion

    #region Admin

    private static readonly string languagesGetQ = @"
        SELECT l.id, l.name, l.""sortingOrder"", l.code
        FROM sv.language l
        WHERE l.""isDeleted"" = 0::bit;
    ";
    public async Task<ReqResult<LanguageDTO>> languagesGet() {
        await using (var cmd = new NpgsqlCommand(languagesGetQ, db.conn)) {
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<LanguageDTO>(reader);
            }
        }
    }

    private static readonly string taskGroupsGetQ = @"
        SELECT id, name, code FROM sv.""taskGroup""
        WHERE ""isDeleted""=0::bit;
    ";
    public async Task<ReqResult<TaskGroupDTO>> taskGroupsGet() {
        await using (var cmd = new NpgsqlCommand(taskGroupsGetQ, db.conn)) {
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<TaskGroupDTO>(reader);
            }
        }
    }

    private static readonly string tasksFromGroupGetQ = @"
        SELECT id, name, description FROM sv.""task""
        WHERE ""taskGroupId""=@tgId AND ""isDeleted""=0::bit;
    ";
    public async Task<ReqResult<TaskDTO>> tasksFromGroupGet(int taskGroup) {
        await using (var cmd = new NpgsqlCommand(tasksFromGroupGetQ, db.conn)) {
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

    private static readonly string taskGroupCreateQ = @"
        INSERT INTO sv.""taskGroup""(name, code, ""isDeleted"") VALUES (@name, @code, 0::bit);
    ";
    private static readonly string taskGroupUpdateQ = @"
        UPDATE sv.""taskGroup"" SET name=@name, ""isDeleted"" = @isDeleted
        WHERE id=@existingId;
    ";
    public async Task<int> taskGroupCU(TaskGroupCUDTO dto) {
        return await createOrUpdate<TaskGroupCUDTO>(taskGroupCreateQ, taskGroupUpdateQ, taskGroupParamAdder, dto);
    }

    private static readonly string taskGetQ = @"
        SELECT t.id, tg.name AS ""taskGroupName"", t.name, t.description FROM sv.""task"" t
        JOIN sv.""taskGroup"" tg ON tg.id=t.""taskGroupId""
        WHERE t.id = @taskId;
    ";
    public async Task<ReqResult<TaskDTO>> taskGet(int taskId) {
        await using (var cmd = new NpgsqlCommand(taskGetQ, db.conn)) {
            cmd.Parameters.AddWithValue("taskId", NpgsqlTypes.NpgsqlDbType.Integer, taskId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<TaskDTO>(reader);
            }
        }
    }

    private static readonly string taskForTLGetQ = @"
        SELECT t.id, tg.name AS ""taskGroupName"", t.name, t.description FROM sv.""taskLanguage"" tl
        JOIN sv.task t ON t.id=tl.""taskId""
        JOIN sv.""taskGroup"" tg ON tg.id=t.""taskGroupId""
        WHERE tl.id = @tlId AND t.""isDeleted"" = 0::bit;
    ";
    public async Task<ReqResult<TaskDTO>> taskForTLGet(int tlId) {
        await using (var cmd = new NpgsqlCommand(taskForTLGetQ, db.conn)) {
            cmd.Parameters.AddWithValue("tlId", NpgsqlTypes.NpgsqlDbType.Integer, tlId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<TaskDTO>(reader);
            }
        }
    }

    private static readonly string tasksAllQ = @"
        SELECT t.id AS ""existingId"", ""taskGroupId"", tg.name AS ""taskGroupName"", t.name, t.description, t.""isDeleted""
        FROM sv.task t
        JOIN sv.""taskGroup"" tg ON tg.id = t.""taskGroupId"";
    ";
    public async Task<ReqResult<TaskCUIntern>> tasksAll() {
        await using (var cmd = new NpgsqlCommand(tasksAllQ, db.conn)) {
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<TaskCUIntern>(reader);
            }
        }
    }

    private static readonly string taskGroupsAllQ = @"
        SELECT id AS ""existingId"", code, name, ""isDeleted""
        FROM sv.""taskGroup"";
    ";
    public async Task<ReqResult<TaskGroupCUDTO>> taskGroupsAll() {
        await using (var cmd = new NpgsqlCommand(taskGroupsAllQ, db.conn)) {
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<TaskGroupCUDTO>(reader);
            }
        }
    }

    private static readonly string languagesAllQ = @"
        SELECT id AS ""existingId"", code, name, ""sortingOrder"", ""isDeleted""
        FROM sv.language;
    ";
    public async Task<ReqResult<LanguageCUDTO>> languagesAll() {
        await using (var cmd = new NpgsqlCommand(languagesAllQ, db.conn)) {
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<LanguageCUDTO>(reader);
            }
        }
    }

    private static readonly string taskCreateQ = @"
        INSERT INTO sv.task(name, ""taskGroupId"", description) VALUES (@name, @tgId, @description);
    "; // TODO check for isDeleted
    private static readonly string taskUpdateQ = @"
        UPDATE sv.task SET name=@name, ""taskGroupId""=@tgId, description=@description
        WHERE id=@existingId;
    "; // TODO check for isDeleted
    public async Task<int> taskCU(TaskCUDTO dto) {
        return await createOrUpdate<TaskCUDTO>(taskCreateQ, taskUpdateQ, taskParamAdder, dto);
    }

    private static readonly string languageCreateQ = @"
        INSERT INTO sv.language(code, name, ""isDeleted"", ""sortingOrder"") VALUES (@code, @name, 0::bit, @sortingOrder);
    ";
    private static readonly string languageUpdateQ = @"
        UPDATE sv.language SET code=@code, name=@name,
                               ""isDeleted""=@isDeleted, ""sortingOrder""=@sortingOrder
        WHERE id=@existingId;
    ";
    public async Task<int> languageCU(LanguageCUDTO dto) {
        return await createOrUpdate<LanguageCUDTO>(languageCreateQ, languageUpdateQ, languageParamAdder, dto);
    }

    private static readonly string taskGroupsForArrayLanguagesQ = @"
        SELECT DISTINCT tg.id, tg.name, tg.code FROM sv.task t
        JOIN sv.""taskLanguage"" tl ON tl.""taskId""=t.id
        JOIN sv.""taskGroup"" tg ON tg.id=t.""taskGroupId""
        WHERE tl.""languageId"" = ANY(@ls);
    ";
    private async Task<ReqResult<TaskGroupDTO>> taskGroupsForArrayLanguages(int[] langs) {
        await using (var cmd = new NpgsqlCommand(taskGroupsForArrayLanguagesQ, db.conn)) {
            cmd.Parameters.AddWithValue("ls", NpgsqlTypes.NpgsqlDbType.Array|NpgsqlTypes.NpgsqlDbType.Integer, langs);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<TaskGroupDTO>(reader);
            }
        }
    }

    private static readonly string statsForAdminQ = @"
        SELECT
        	SUM(CASE WHEN s.status=3 AND tl.id IS NOT NULL THEN 1 ELSE 0 END) AS ""primaryCount"",
        	SUM(CASE WHEN s.status=3 AND tl.id IS NULL THEN 1 ELSE 0 END) AS ""alternativeCount"",
        	SUM(CASE WHEN s.status != 1 THEN 1 ELSE 0 END) AS ""proposalCount""
        FROM sv.snippet s
        LEFT JOIN sv.""taskLanguage"" tl ON tl.""primarySnippetId""=s.id;
    ";
    public async Task<ReqResult<StatsDTO>> statsForAdmin() {
        await using (var cmd = new NpgsqlCommand(statsForAdminQ, db.conn)) {
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<StatsDTO>(reader);
            }
        }
    }

    #endregion

    #region Users
    private static readonly string userAuthentGetQ = @"
        SELECT id AS ""userId"", encode(hash, 'base64') AS hash, encode(salt, 'base64') AS salt, expiration, ""accessToken""
        FROM sv.user WHERE name = @name;
    ";
    public async Task<ReqResult<AuthenticateIntern>> userAuthentGet(string userName) {
        await using (var cmd = new NpgsqlCommand(userAuthentGetQ, db.conn)) {
            cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, userName);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<AuthenticateIntern>(reader);
            }
        }
    }

    private static readonly string userAuthorizGetQ = @"
        SELECT ""accessToken"", expiration
        FROM sv.user WHERE id = @id;
    ";
    public async Task<ReqResult<AuthorizeIntern>> userAuthorizGet(int userId) {
        await using (var cmd = new NpgsqlCommand(userAuthorizGetQ, db.conn)) {
            cmd.Parameters.AddWithValue("id", NpgsqlTypes.NpgsqlDbType.Integer, userId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<AuthorizeIntern>(reader);
            }
        }
    }


    private static readonly string userAdminAuthorizQ = @"
        SELECT ""accessToken"", expiration
        FROM sv.user WHERE name = @name;
    ";
    public async Task<ReqResult<AuthorizeIntern>> userAdminAuthoriz() {
        await using (var cmd = new NpgsqlCommand(userAdminAuthorizQ, db.conn)) {
            cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, AdminPasswordChecker.adminName);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<AuthorizeIntern>(reader);
            }
        }
    }

    private static readonly string userUpdateExpirationQ = @"
        UPDATE sv.""user"" SET expiration=@newDate, ""accessToken"" = @newToken
        WHERE id = @id;
    ";
    public async Task<int> userUpdateExpiration(int userId, string newToken, DateTime newDate) {
        await using (var cmd = new NpgsqlCommand(userUpdateExpirationQ, db.conn)) {
            cmd.Parameters.AddWithValue("id", NpgsqlTypes.NpgsqlDbType.Integer, userId);
            cmd.Parameters.AddWithValue("newDate", NpgsqlTypes.NpgsqlDbType.Date, newDate);
            cmd.Parameters.AddWithValue("newToken", NpgsqlTypes.NpgsqlDbType.Varchar, newToken);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    private static readonly string userRegisterQ = @"
        INSERT INTO sv.""user""(name, ""dateJoined"", expiration, ""accessToken"", hash, salt)
        VALUES (@name, @tsJoin, @dtExpiration, @accessToken,
                decode(@hash, 'base64'), decode(@salt, 'base64'))
        ON CONFLICT DO NOTHING RETURNING id;
    ";
    public async Task<int> userRegister(UserNewIntern user) {
        await using (var cmd = new NpgsqlCommand(userRegisterQ, db.conn)) {
            cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, user.userName);
            cmd.Parameters.AddWithValue("salt", NpgsqlTypes.NpgsqlDbType.Varchar, user.salt);
            cmd.Parameters.AddWithValue("hash", NpgsqlTypes.NpgsqlDbType.Varchar, user.hash);
            cmd.Parameters.AddWithValue("accessToken", NpgsqlTypes.NpgsqlDbType.Varchar, user.accessToken);
            cmd.Parameters.AddWithValue("tsJoin", NpgsqlTypes.NpgsqlDbType.TimestampTz, DateTime.Now.ToUniversalTime());
            cmd.Parameters.AddWithValue("dtExpiration", NpgsqlTypes.NpgsqlDbType.Date, user.dtExpiration);
            var mbNewInt = cmd.ExecuteScalar();
            return mbNewInt != null ? (int)mbNewInt : 0;
        }
    }

    private static readonly string userUpdateQ = @"
        UPDATE sv.user SET hash = decode(@hash, 'base64'), salt = decode(@salt, 'base64'),
                           expiration = @dtExpiration, ""accessToken"" = @accessToken
        WHERE name = @name;
    ";
    public async Task<int> userUpdate(UserNewIntern user) {
        await using (var cmd = new NpgsqlCommand(userUpdateQ, db.conn)) {
            cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, user.userName);
            cmd.Parameters.AddWithValue("salt", NpgsqlTypes.NpgsqlDbType.Varchar, user.salt);
            cmd.Parameters.AddWithValue("hash", NpgsqlTypes.NpgsqlDbType.Varchar, user.hash);
            cmd.Parameters.AddWithValue("accessToken", NpgsqlTypes.NpgsqlDbType.Varchar, user.accessToken);
            cmd.Parameters.AddWithValue("dtExpiration", NpgsqlTypes.NpgsqlDbType.Date, user.dtExpiration);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    private static readonly string commentsGetQ = @"
        SELECT c.content, c.""tsUpload"", c.id, u.name AS author
		FROM sv.comment c
		JOIN sv.user u ON u.id=c.""userId""
		WHERE c.""snippetId"" = @snId;
    ";
    public async Task<ReqResult<CommentDTO>> commentsGet(int snippetId) {
        await using (var cmd = new NpgsqlCommand(commentsGetQ, db.conn)) {
            cmd.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, snippetId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<CommentDTO>(reader);
            }
        }
    }

    private static readonly string userCountQ = @"
        SELECT COUNT(*)
        FROM sv.user WHERE ""isDeleted"" = 0::bit;
    ";
    public async Task<long> userCount() {
        await using (var cmd = new NpgsqlCommand(userCountQ, db.conn)) {
            return (long)cmd.ExecuteScalar();
        }
    }

    private static readonly string userVoteQ = @"
        BEGIN;
        WITH existingVote AS (
            SELECT uv.""snippetId"" FROM sv.""userVote"" uv
            WHERE uv.""userId""=@userId AND uv.""taskLanguageId""=@tlId LIMIT 1
        )
        UPDATE sv.snippet SET score=score-1 WHERE id IN (SELECT ""snippetId"" FROM existingVote);

        INSERT INTO sv.""userVote""(""userId"", ""taskLanguageId"", ""snippetId"")
        VALUES (@userId, @tlId, @snId)
        ON CONFLICT(""userId"", ""taskLanguageId"")
        DO UPDATE SET ""snippetId""=EXCLUDED.""snippetId"";

        UPDATE sv.snippet
        SET score=score + 1 WHERE id=@snId;

        COMMIT;
    ";
    public async Task<int> userVote(int userId, int tlId, int snId) {
        await using (var cmd = new NpgsqlCommand(userVoteQ, db.conn)) {
            cmd.Parameters.AddWithValue("userId", NpgsqlTypes.NpgsqlDbType.Integer, userId);
            cmd.Parameters.AddWithValue("tlId", NpgsqlTypes.NpgsqlDbType.Integer, tlId);
            cmd.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, snId);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    private static readonly string userProfileQ = @"
        SELECT
        	SUM(CASE WHEN s.status IN (1, 3) THEN 1 ELSE 0 END) AS ""proposalCount"",
        	SUM(CASE WHEN s.status = 3 THEN 1 ELSE 0 END) AS ""approvedCount"",
        	SUM(CASE WHEN s.status = 3 AND tl.id IS NOT NULL THEN 1 ELSE 0 END) AS ""primaryCount""
        FROM sv.snippet s
        LEFT JOIN sv.""taskLanguage"" tl ON tl.""primarySnippetId"" = s.id
        WHERE ""authorId"" = @userId;
    ";
    public async Task<ReqResult<ProfileDTO>> userProfile(int userId) {
        await using (var cmd = new NpgsqlCommand(userProfileQ, db.conn)) {
            cmd.Parameters.AddWithValue("userId", NpgsqlTypes.NpgsqlDbType.Integer, userId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<ProfileDTO>(reader);
            }
        }
    }

    private static readonly string userDataQ = @"
        SELECT name, ""dateJoined"" AS ""tsJoined"" FROM sv.user WHERE id = @userId;
    ";
    public async Task<ReqResult<UserDTO>> userData(int userId) {
        await using (var cmd = new NpgsqlCommand(userDataQ, db.conn)) {
            cmd.Parameters.AddWithValue("userId", NpgsqlTypes.NpgsqlDbType.Integer, userId);
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<UserDTO>(reader);
            }
        }
    }

    private static readonly string commentCreateQ = @"
        INSERT INTO sv.comment(""userId"", ""snippetId"", content, ""tsUpload"")
        VALUES (@userId, @snId, @content, @ts);
    ";
    public async Task<int> commentCreate(int userId, int snId, string content, DateTime ts) {
        await using (var cmd = new NpgsqlCommand(commentCreateQ, db.conn)) {
            cmd.Parameters.AddWithValue("userId", NpgsqlTypes.NpgsqlDbType.Integer, userId);
            cmd.Parameters.AddWithValue("content", NpgsqlTypes.NpgsqlDbType.Varchar, content);
            cmd.Parameters.AddWithValue("snId", NpgsqlTypes.NpgsqlDbType.Integer, snId);
            cmd.Parameters.AddWithValue("ts", NpgsqlTypes.NpgsqlDbType.TimestampTz, ts);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    private static readonly string commentDeleteQ = @"
        DELETE FROM sv.comment WHERE id=@commentId;
    ";
    public async Task<int> commentDelete(int commentId) {
        await using (var cmd = new NpgsqlCommand(commentDeleteQ, db.conn)) {
            cmd.Parameters.AddWithValue("commentId", NpgsqlTypes.NpgsqlDbType.Integer, commentId);
            return await cmd.ExecuteNonQueryAsync();
        }
    }

    #endregion

    #region Utils
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
        if (dto.existingId < 0) {
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
        cmd.Parameters.AddWithValue("tgId", NpgsqlTypes.NpgsqlDbType.Integer, dto.taskGroup.id);
    }

    private static void taskGroupParamAdder(NpgsqlCommand cmd, TaskGroupCUDTO dto) {
        cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, dto.name);
        cmd.Parameters.AddWithValue("code", NpgsqlTypes.NpgsqlDbType.Varchar, dto.code);
        cmd.Parameters.AddWithValue("isDeleted", NpgsqlTypes.NpgsqlDbType.Bit, dto.isDeleted);
    }

    private static void languageParamAdder(NpgsqlCommand cmd, LanguageCUDTO dto) {
        cmd.Parameters.AddWithValue("name", NpgsqlTypes.NpgsqlDbType.Varchar, dto.name);
        cmd.Parameters.AddWithValue("code", NpgsqlTypes.NpgsqlDbType.Varchar, dto.code);
        cmd.Parameters.AddWithValue("sortingOrder", NpgsqlTypes.NpgsqlDbType.Integer, dto.sortingOrder);
        cmd.Parameters.AddWithValue("isDeleted", NpgsqlTypes.NpgsqlDbType.Bit, dto.isDeleted);
    }
    #endregion
}

}
