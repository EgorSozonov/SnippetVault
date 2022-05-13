package tech.sozonov.SnippetVault.portsIn.store.db;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.val;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.core.DTO.AuxDTO.TaskGroup;
import tech.sozonov.SnippetVault.core.DTO.SnippetDTO.Snippet;
import tech.sozonov.SnippetVault.core.utils.Types.ReqResult;
import tech.sozonov.SnippetVault.portsIn.IStore;

public class DBStore implements IStore {


// CND806675Q
// 15-bs654ur
private Connection conn;

@Autowired
public DBStore(Connection _conn) {
    conn = _conn;
}

private static final String snippetsQ = """
    SELECT sn1.id as "leftId", sn1.content as "leftCode", tl1.id AS "leftTlId", sn1.libraries as "leftLibraries",
           t.id AS "taskId", t.name AS "taskName",
	       sn2.id AS "rightId", sn2.content AS "rightCode", tl2.id AS "rightTlId", sn2.libraries as "rightLibraries"
	FROM sv."task" AS t
	LEFT JOIN sv."taskLanguage" tl1 ON tl1."taskId"=t.id AND tl1."languageId"=:l1
	LEFT JOIN sv."taskLanguage" tl2 ON tl2."taskId"=t.id AND tl2."languageId"=:l2
	LEFT JOIN sv.language l1 ON l1.id=tl1."languageId"
	LEFT JOIN sv.language l2 ON l2.id=tl2."languageId"
	LEFT JOIN sv.snippet sn1 ON sn1.id=tl1."primarySnippetId"
	LEFT JOIN sv.snippet sn2 ON sn2.id=tl2."primarySnippetId"
	WHERE t."taskGroupId"=:tgId AND t."isDeleted"=0::bit;
""";
public Flux<Snippet> snippetsGet(int taskGroup, int lang1, int lang2) {
    val deserializer = new Deserializer<Snippet>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(snippetsQ)
                            .bind(":l1", lang1)
                            .bind(":l2", lang1)
                            .bind(":tgId", taskGroup)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}


private static final String snippetsGetByCodeQ = """
    WITH taskLangs1 AS (
    	SELECT tl.id, tl."taskId", l.id AS "languageId", "primarySnippetId"
    	FROM sv."taskLanguage" tl
    	JOIN sv.language l ON l.id=tl."languageId"
    	WHERE code=:l1Code
    ),
    taskLangs2 AS (
    	SELECT tl.id, tl."taskId", l.id AS "languageId", "primarySnippetId"
    	FROM sv."taskLanguage" tl
    	JOIN sv.language l ON l.id=tl."languageId"
    	WHERE code=:l2Code
    )
    SELECT sn1.id as "leftId", sn1.content as "leftCode", tl1.id AS "leftTlId", sn1.libraries as "leftLibraries",
    	   t.id AS "taskId", t.name AS "taskName",
    	   sn2.id AS "rightId", sn2.content AS "rightCode", tl2.id AS "rightTlId", sn2.libraries as "rightLibraries"
    FROM sv."task" AS t
    JOIN sv."taskGroup" tg ON tg.id=t."taskGroupId" AND tg.code=:tgCode
    LEFT JOIN taskLangs1 tl1 ON tl1."taskId"=t.id
    LEFT JOIN taskLangs2 tl2 ON tl2."taskId"=t.id
    LEFT JOIN sv.snippet sn1 ON sn1.id=tl1."primarySnippetId"
    LEFT JOIN sv.snippet sn2 ON sn2.id=tl2."primarySnippetId"
    WHERE t."isDeleted"=0::bit;
""";
public Flux<Snippet> snippetsGetByCode(String taskGroup, String lang1, String lang2) {
    val deserializer = new Deserializer<Snippet>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(snippetsGetByCodeQ)
                            .bind(":l1Code", lang1)
                            .bind(":l2Code", lang1)
                            .bind(":tgId", taskGroup)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String snippetGetQ = """
    SELECT "taskLanguageId", "status", content, score, libraries
	FROM sv.snippet s
	WHERE id = :snId;
""";
public Mono<SnippetIntern> snippetGet(int snId) {
    val deserializer = new Deserializer<SnippetIntern>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(snippetGetQ)
                            .bind(":snId", snId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String proposalsGetQ = """
    SELECT lang.name AS "languageName", task.name AS "taskName",
		   sn.id AS "proposalId", sn.content, sn."tsUpload", u.name AS author, u.id AS "authorId"
	FROM sv.snippet sn
	JOIN sv."taskLanguage" tl ON tl.id=sn."taskLanguageId"
	JOIN sv.task task ON task.id=tl."taskId"
	JOIN sv.language lang ON lang.id=tl."languageId"
    JOIN sv.user u ON u.id=sn."authorId"
	WHERE sn.status=1 AND lang."isDeleted"=0::bit AND task."isDeleted"=0::bit;
""";
public Flux<Proposal> proposalsGet() {
    val deserializer = new Deserializer<Snippet>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(proposalsGetQ)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String taskLanguageCreateQ = """
    INSERT INTO sv."taskLanguage"("taskId", "languageId", "primarySnippetId")
    VALUES (:taskId, :langId, NULL)
    ON CONFLICT ("taskId", "languageId") DO UPDATE SET "languageId"=:langId
    RETURNING id;
""";
private static final String proposalCreateQ = """
    INSERT INTO sv.snippet("taskLanguageId", content, status, score, libraries, "tsUpload", "authorId")
    VALUES (:tlId, :content, 1, 0, :libraries, :ts, :authorId);
""";
public Mono<Integer> proposalCreate(ProposalCreate dto, int authorId) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(taskLanguageCreateQ)
                            .bind(":taskId", dto.taskId)
                            .bind(":langId", dto.langId)
                            .returnGeneratedValues("id")
                            .execute())
    	)
        .flatMap(tlId -> {
            Mono.from(conn)
                .flatMap(
                    c -> Mono.from(c.createStatement(proposalCreateQ)
                                    .bind(":tlId", tlId)
                                    .bind(":content", dto.content)
                                    .bind(":libraries", dto.libraries)
                                    .bind(":ts", LocalDateTime.now())
                                    .bind(":authorId", authorId)
                                    .execute())
            	)
                .flatMap(result -> result.getRowsUpdated());
        });
}

private static final String proposalUpdateQ = """
    UPDATE sv.snippet SET content = :content, libraries = :libraries
    WHERE id = :snId;
""";
public Mono<Integer> proposalUpdate(ProposalUpdate dto) {
    val newLibraries = dto.libraries != null && dto.libraries.Length > 0 ? dto.libraries : null;
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(proposalUpdateQ)
                            .bind(":snId", dto.existingId)
                            .bind(":content", dto.content)
                            .bind(":libraries", newLibraries)
                            .execute())
    	)
        .flatMap(result -> result.getRowsUpdated());
}

private static final String snippetApproveQ = """
    BEGIN;

    UPDATE sv."taskLanguage" AS tl
    SET "primarySnippetId" = :snId
    FROM sv.snippet AS sn
    WHERE sn."taskLanguageId" = tl.id AND sn.id = :snId AND tl."primarySnippetId" IS NULL;

    UPDATE sv.snippet SET status = 3 WHERE id = :snId;

    COMMIT;
""";
public  Mono<Integer> snippetApprove(int snId) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(snippetApproveQ)
                            .bind(":snId", snId)
                            .execute())
    	)
        .flatMap(result -> result.getRowsUpdated());
}


private static final String snippetDeclineQ = """
    UPDATE sv.snippet SET status=2 WHERE id = :snId;
""";
public  Mono<Integer> snippetDecline(int snId) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(snippetDeclineQ)
                            .bind(":snId", snId)
                            .execute())
    	)
        .flatMap(result -> result.getRowsUpdated());
}

private static final String snippetMarkPrimaryQ = """
    UPDATE sv."taskLanguage" SET "primarySnippetId" = :snId WHERE id=:tlId;
""";
public  Mono<Integer> snippetMarkPrimary(int tlId, int snId) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(snippetMarkPrimaryQ)
                            .bind(":tlId", tlId)
                            .bind(":snId", snId)
                            .execute())
    	)
        .flatMap(result -> result.getRowsUpdated());
}

private static final String alternativesForTLGetQ = """
    SELECT sn.id, sn.content AS content, sn."tsUpload", sn.score, COUNT(c.id) AS "commentCount"
    FROM sv."taskLanguage" tl
    JOIN sv.snippet sn ON sn.id=tl."primarySnippetId"
    LEFT JOIN sv.comment c ON c."snippetId" = sn.id
    WHERE tl.id=:tlId
    GROUP BY sn.id, sn.content, sn."tsUpload", sn.score

    UNION ALL

    SELECT sn.id, sn.content, sn."tsUpload", sn.score, COUNT(c.id) AS "commentCount"
    FROM sv.snippet sn
    LEFT JOIN sv.comment c ON c."snippetId" = sn.id
    WHERE sn."taskLanguageId" = :tlId AND sn.status = 3
    GROUP BY sn.id, sn.content, sn."tsUpload", sn.score;
""";
public Flux<Alternative> alternativesForTLGet(int taskLanguageId) {
    val deserializer = new Deserializer<Alternative>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(proposalsGetQ)
                            .bind("tlId", taskLanguageId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String alternativesForUserGetQ = """
    SELECT sn.id, sn.content, sn."tsUpload", sn.score, COUNT(c.id) AS "commentCount",
           (CASE WHEN uv."snippetId" IS NULL THEN FALSE ELSE TRUE END) AS "voteFlag"
    FROM sv."taskLanguage" tl
    JOIN sv.snippet sn ON sn.id=tl."primarySnippetId"
    LEFT JOIN sv."userVote" uv ON uv."userId" = :userId AND uv."snippetId"=sn.id
    LEFT JOIN sv.comment c ON c."snippetId" = sn.id
    WHERE tl.id = :tlId
    GROUP BY sn.id, sn.content, sn."tsUpload", sn.score, "voteFlag"

    UNION ALL

    SELECT sn.id, sn.content, sn."tsUpload", sn.score, COUNT(c.id) AS "commentCount",
           (CASE WHEN uv."snippetId" IS NULL THEN FALSE ELSE TRUE END) AS "voteFlag"
    FROM sv.snippet sn
    LEFT JOIN sv.comment c ON c."snippetId" = sn.id
    LEFT JOIN sv."userVote" uv ON uv."userId" = :userId AND uv."snippetId" = sn.id
    WHERE sn."taskLanguageId"=:tlId AND sn.status = 3
    GROUP BY sn.id, sn.content, sn."tsUpload", sn.score, "voteFlag";
""";
public Flux<Alternative> alternativesForUserGet(int taskLanguageId, int userId) {
    val deserializer = new Deserializer<Alternative>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(alternativesForUserGetQ)
                            .bind("tlId", taskLanguageId)
                            .bind("userId", userId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String languagesGetQ = """
    SELECT l.id, l.name, l."sortingOrder", l.code
    FROM sv.language l
    WHERE l."isDeleted" = 0::bit;
""";
public Flux<Language> languagesGet() {
    val deserializer = new Deserializer<Language>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(languagesGetQ)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String taskGroupsGetQ = """
    SELECT id, name, code FROM sv."taskGroup"
    WHERE "isDeleted"=0::bit;
""";
public Flux<TaskGroup> taskGroupsGet() {
    val deserializer = new Deserializer<TaskGroup>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(taskGroupsGetQ)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String tasksFromGroupGetQ = """
    SELECT id, name, description FROM sv."task"
    WHERE "taskGroupId"=:tgId AND "isDeleted"=0::bit;
""";
public Flux<Task> tasksFromGroupGet(int taskGroup) {
    val deserializer = new Deserializer<Task>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(tasksFromGroupGetQ)
                            .bind("tgId", taskGroup)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

public Flux<TaskGroup> taskGroupsForLangGet(int langId) {
    return taskGroupsForArrayLanguages(new int[] {langId});
}

public Flux<TaskGroup> taskGroupsForLangsGet(int lang1, int lang2) {
    return taskGroupsForArrayLanguages(new int[] {lang1, lang2});
}

private static final String taskGroupCreateQ = """
    INSERT INTO sv."taskGroup"(name, code, "isDeleted") VALUES (:name, :code, 0::bit);
""";
private static final String taskGroupUpdateQ = """
    UPDATE sv."taskGroup" SET name=:name, "isDeleted" = :isDeleted
    WHERE id=:existingId;
""";
public Mono<Integer> taskGroupCU(TaskGroupCU dto) {
    return createOrUpdate<TaskGroupCU>(taskGroupCreateQ, taskGroupUpdateQ, taskGroupParamAdder, dto);
}

private static final String taskGetQ = """
    SELECT t.id, tg.name AS "taskGroupName", t.name, t.description FROM sv."task" t
    JOIN sv."taskGroup" tg ON tg.id=t."taskGroupId"
    WHERE t.id = :taskId;
""";
public Mono<Task> taskGet(int taskId) {
    val deserializer = new Deserializer<Task>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(taskGetQ)
                            .bind("taskId", taskId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String taskForTLGetQ = """
    SELECT t.id, tg.name AS "taskGroupName", t.name, t.description FROM sv."taskLanguage" tl
    JOIN sv.task t ON t.id=tl."taskId"
    JOIN sv."taskGroup" tg ON tg.id=t."taskGroupId"
    WHERE tl.id = :tlId AND t."isDeleted" = 0::bit;
""";
public Mono<Task> taskForTLGet(int tlId) {
    val deserializer = new Deserializer<Task>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(tasksFromGroupGetQ)
                            .bind("tlId", tlId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String tasksAllQ = """
    SELECT t.id AS "existingId", "taskGroupId", tg.name AS "taskGroupName", t.name, t.description, t."isDeleted"
    FROM sv.task t
    JOIN sv."taskGroup" tg ON tg.id = t."taskGroupId";
""";
public Flux<TaskCUIntern> tasksAll() {
    val deserializer = new Deserializer<TaskCUIntern>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(tasksAllQ)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String taskGroupsAllQ = """
    SELECT id AS "existingId", code, name, "isDeleted"
    FROM sv."taskGroup";
""";
public  Flux<TaskGroupCU> taskGroupsAll() {
    val deserializer = new Deserializer<TaskGroupCU>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(taskGroupsAllQ)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String languagesAllQ = """
    SELECT id AS "existingId", code, name, "sortingOrder", "isDeleted"
    FROM sv.language;
""";
public Mono<ReqResult<LanguageCUDTO>> languagesAll() {
    try (val cmd = new NpgsqlCommand(languagesAllQ, db.conn)) {
        try (val reader = await cmd.ExecuteReaderAsync()) {
            return readResultSet<LanguageCUDTO>(reader);
        }
    }
}

private static final String taskCreateQ = """
    INSERT INTO sv.task(name, "taskGroupId", description) VALUES (:name, :tgId, :description);
"""; // TODO check for isDeleted
private static final String taskUpdateQ = """
    UPDATE sv.task SET name=:name, "taskGroupId"=:tgId, description=:description
    WHERE id=:existingId;
"""; // TODO check for isDeleted
public Mono<Integer> taskCU(TaskCU dto) {
    return createOrUpdate<TaskCU>(taskCreateQ, taskUpdateQ, taskParamAdder, dto);
}

private static final String languageCreateQ = """
    INSERT INTO sv.language(code, name, "isDeleted", "sortingOrder") VALUES (:code, :name, 0::bit, :sortingOrder);
""";
private static final String languageUpdateQ = """
    UPDATE sv.language SET code=:code, name=:name,
                           "isDeleted"=:isDeleted, "sortingOrder"=:sortingOrder
    WHERE id=:existingId;
""";
public  Mono<Integer> languageCU(LanguageCU dto) {
    return createOrUpdate<LanguageCU>(languageCreateQ, languageUpdateQ, languageParamAdder, dto);
}

private static final String taskGroupsForArrayLanguagesQ = """
    SELECT DISTINCT tg.id, tg.name, tg.code FROM sv.task t
    JOIN sv."taskLanguage" tl ON tl."taskId"=t.id
    JOIN sv."taskGroup" tg ON tg.id=t."taskGroupId"
    WHERE tl."languageId" = ANY(:ls);
""";
private Flux<TaskGroup> taskGroupsForArrayLanguages(int[] langs) {
    val deserializer = new Deserializer<TaskGroup>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(taskGroupsForArrayLanguagesQ)
                            .bind("ls", langs)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String statsForAdminQ = """
    SELECT
    	SUM(CASE WHEN s.status=3 AND tl.id IS NOT NULL THEN 1 ELSE 0 END) AS "primaryCount",
    	SUM(CASE WHEN s.status=3 AND tl.id IS NULL THEN 1 ELSE 0 END) AS "alternativeCount",
    	SUM(CASE WHEN s.status != 1 THEN 1 ELSE 0 END) AS "proposalCount"
    FROM sv.snippet s
    LEFT JOIN sv."taskLanguage" tl ON tl."primarySnippetId"=s.id;
""";
public Mono<Stats> statsForAdmin() {
    val deserializer = new Deserializer<Stats>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(statsForAdminQ)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String userAuthentGetQ = """
    SELECT id AS "userId", encode(hash, 'base64') AS hash, encode(salt, 'base64') AS salt, expiration, "accessToken"
    FROM sv.user WHERE name = :name;
""";
public  Mono<AuthenticateIntern> userAuthentGet(String userName) {
    val deserializer = new Deserializer<AuthenticateIntern>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userAuthentGetQ)
                            .bind("name", userName)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String userAuthorizGetQ = """
    SELECT "accessToken", expiration
    FROM sv.user WHERE id = :id;
""";
public Mono<AuthorizeIntern> userAuthorizGet(int userId) {
    val deserializer = new Deserializer<AuthorizeIntern>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userAuthorizGetQ)
                            .bind("id", userId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}


private static final String userAdminAuthorizQ = """
    SELECT "accessToken", expiration
    FROM sv.user WHERE name = :name;
""";
public  Mono<AuthorizeIntern> userAdminAuthoriz() {
    val deserializer = new Deserializer<AuthorizeIntern>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userAdminAuthorizQ)
                            .bind("name", AdminPasswordChecker.adminName)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String userUpdateExpirationQ = """
    UPDATE sv."user" SET expiration=:newDate, "accessToken" = :newToken
    WHERE id = :id;
""";
public Mono<Integer> userUpdateExpiration(int userId, String newToken, LocalDateTime newDate) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userUpdateExpirationQ)
                            .bind("id", userId)
                            .bind("newDate", newDate)
                            .bind("newToken", newToken)
                            .execute())
    	)
        .flatMap(result -> result.getRowsUpdated());
}

private static final String userRegisterQ = """
    INSERT INTO sv."user"(name, "dateJoined", expiration, "accessToken", hash, salt)
    VALUES (:name, :tsJoin, :dtExpiration, :accessToken,
            decode(:hash, 'base64'), decode(:salt, 'base64'))
    ON CONFLICT DO NOTHING RETURNING id;
""";
public Mono<Integer> userRegister(UserNewIntern user) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userRegisterQ)
                            .bind("name", user.userName)
                            .bind("salt", user.salt)
                            .bind("hash", user.hash)
                            .bind("accessToken", user.accessToken)
                            .bind("tsJoin", LocalDateTime.now())
                            .bind("dtExpiration", user.dtExpiration)
                            .returnGeneratedValues("id")
                            .execute())
    	)
        .flatMap(result -> result != null ? result : 0);
}

private static final String userUpdateQ = """
    UPDATE sv.user SET hash = decode(:hash, 'base64'), salt = decode(:salt, 'base64'),
                       expiration = :dtExpiration, "accessToken" = :accessToken
    WHERE name = :name;
""";
public Mono<Integer> userUpdate(UserNewIntern user) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userUpdateQ)
                            .bind("name", user.userName)
                            .bind("salt", user.salt)
                            .bind("hash", user.hash)
                            .bind("accessToken", user.accessToken)
                            .bind("dtExpiration", user.dtExpiration)
                            .execute())
    	)
        .flatMap(result -> result.getRowsUpdated());

}

private static final String commentsGetQ = """
    SELECT c.content, c."tsUpload", c.id, u.name AS author
	FROM sv.comment c
	JOIN sv.user u ON u.id=c."userId"
	WHERE c."snippetId" = :snId;
""";
public Mono<Comment> commentsGet(int snippetId) {
    val deserializer = new Deserializer<Comment>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(commentsGetQ)
                            .bind("snId", snippetId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
            val deserializer = new Deserializer<AuthorizeIntern>();
}

private static final String userCountQ = """
    SELECT COUNT(*) AS Cnt
    FROM sv.user WHERE "isDeleted" = 0::bit;
""";
public Mono<Long> userCount() {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userCountQ)
                            .returnGeneratedValues("cnt")
                            .execute())
    	);
}

private static final String userVoteQ = """
    BEGIN;
    WITH existingVote AS (
        SELECT uv."snippetId" FROM sv."userVote" uv
        WHERE uv."userId"=:userId AND uv."taskLanguageId"=:tlId LIMIT 1
    )
    UPDATE sv.snippet SET score=score-1 WHERE id IN (SELECT "snippetId" FROM existingVote);

    INSERT INTO sv."userVote"("userId", "taskLanguageId", "snippetId")
    VALUES (:userId, :tlId, :snId)
    ON CONFLICT("userId", "taskLanguageId")
    DO UPDATE SET "snippetId"=EXCLUDED."snippetId";

    UPDATE sv.snippet
    SET score=score + 1 WHERE id=:snId;

    COMMIT;
""";
public Mono<Integer> userVote(int userId, int tlId, int snId) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userVoteQ)
                            .bind("id", userId)
                            .bind("tlId", tlId)
                            .bind("snId", snId)
                            .execute())
    	)
        .flatMap(result -> result.getRowsUpdated());
}

private static final String userProfileQ = """
    SELECT
    	SUM(CASE WHEN s.status IN (1, 3) THEN 1 ELSE 0 END) AS "proposalCount",
    	SUM(CASE WHEN s.status = 3 THEN 1 ELSE 0 END) AS "approvedCount",
    	SUM(CASE WHEN s.status = 3 AND tl.id IS NOT NULL THEN 1 ELSE 0 END) AS "primaryCount"
    FROM sv.snippet s
    LEFT JOIN sv."taskLanguage" tl ON tl."primarySnippetId" = s.id
    WHERE "authorId" = :userId;
""";
public  Mono<Profile> userProfile(int userId) {
    val deserializer = new Deserializer<Profile>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userProfileQ)
                            .bind("userId", userId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String userDataQ = """
    SELECT name, "dateJoined" AS "tsJoined" FROM sv.user WHERE id = :userId;
""";
public  Mono<User> userData(int userId) {
    val deserializer = new Deserializer<User>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userDataQ)
                            .bind("userId", userId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> return deserializer.read(row)));
}

private static final String commentCreateQ = """
    INSERT INTO sv.comment("userId", "snippetId", content, "tsUpload")
    VALUES (:userId, :snId, :content, :ts);
""";
public Mono<Integer> commentCreate(int userId, int snId, String content, LocalDateTime ts) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(commentCreateQ)
                            .bind("userId", userId)
                            .bind("content", content)
                            .bind("snId", snId)
                            .bind("ts", ts)
                            .execute())
    	)
        .flatMap(result -> result.getRowsUpdated());
}

private static final String commentDeleteQ = """
    DELETE FROM sv.comment WHERE id=:commentId;
""";
public Mono<Integer> commentDelete(int commentId) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(commentDeleteQ)
                            .bind("commentId", commentId)
    	)
        .flatMap(result -> result.getRowsUpdated());
}


private static final String logMessageQ = """
    INSERT INTO sv.log(ts, type, code, msg)
    VALUES (:ts, :msgType, :code, :message);
""";
public  Mono<Integer> logMessage(DateTime ts, int msgType, String code, String message) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(logMessageQ)
                            .bind("ts", ts)
                            .bind("msgType", msgType)
                            .bind("code", code.subString(0, Math.min(16, code.length)))
                            .bind("commentId", commentId)
    	)
        .flatMap(result -> result.getRowsUpdated());
}

private Mono<Result> createOrUpdate<? extends CreateUpdate>(String sqlCreate, String sqlUpdate, BiFunction<Statement, T> paramsAdder, T dto) {
    if (dto.existingId < 0) {
        val st1 = Mono.from(c.createStatement(sqlCreate));
        val st2 = paramsAdder.apply(temp, dto);
        return st2.execute();
    } else {
        val st1 = Mono.from(c.createStatement(sqlUpdate));
        val st2 = paramsAdder.apply(temp, dto).bind("existingId", dto.existingId);
        return st2.execute();
    }
}

private static void taskParamAdder(Statement cmd, TaskCU dto) {
    return cmd.bind("name", dto.name)
              .bind("description", dto.description)
              .bind("tgId", dto.taskGroup.id);
}

private static void taskGroupParamAdder(Statement cmd, TaskGroupCU dto) {
    return cmd.bind("name", dto.name)
              .bind("code", dto.code)
              .bind("isDeleted", dto.isDeleted);
}

private static void languageParamAdder(Statement cmd, LanguageCU dto) {
    return cmd.bind("name", dto.name)
              .bind("code", dto.code)
              .bind("sortingOrder", dto.sortingOrder)
              .bind("isDeleted", dto.isDeleted);
}


}
