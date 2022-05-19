package tech.sozonov.SnippetVault.admin;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.val;
import java.time.LocalDateTime;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import tech.sozonov.SnippetVault.admin.AdminDTO.*;
import tech.sozonov.SnippetVault.cmn.utils.Deserializer;
import tech.sozonov.SnippetVault.cmn.dto.CommonDTO.*;

public class AdminStore implements IAdminStore {
private Connection conn;

@Autowired
public AdminStore(Connection _conn) {
    conn = _conn;
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
public Mono<Integer> snippetDecline(int snId) {
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
public Mono<Integer> snippetMarkPrimary(int tlId, int snId) {
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
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
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
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
}

private static final String taskGroupsAllQ = """
    SELECT id AS "existingId", code, name, "isDeleted"
    FROM sv."taskGroup";
""";
public Flux<TaskGroupCU> taskGroupsAll() {
    val deserializer = new Deserializer<TaskGroupCU>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(taskGroupsAllQ)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
}

private static final String languagesAllQ = """
    SELECT id AS "existingId", code, name, "sortingOrder", "isDeleted"
    FROM sv.language;
""";
public Flux<LanguageCU> languagesAll() {
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
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
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
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
}

private static final String logMessageQ = """
    INSERT INTO sv.log(ts, type, code, msg)
    VALUES (:ts, :msgType, :code, :message);
""";
public  Mono<Integer> logMessage(LocalDateTime ts, int msgType, String code, String message) {
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



}
