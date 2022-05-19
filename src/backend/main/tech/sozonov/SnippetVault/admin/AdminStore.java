package tech.sozonov.SnippetVault.admin;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.val;
import java.time.LocalDateTime;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import tech.sozonov.SnippetVault.admin.AdminDTO.*;
import tech.sozonov.SnippetVault.cmn.utils.Deserializer;
import tech.sozonov.SnippetVault.cmn.dto.CommonDTO.*;
import tech.sozonov.SnippetVault.cmn.internal.InternalTypes.TaskCUIntern;
import static tech.sozonov.SnippetVault.cmn.utils.DB.*;

public class AdminStore implements IAdminStore {


private DatabaseClient db;

@Autowired
public AdminStore(DatabaseClient _db) {
    db = _db;
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
    Mono.from(db)
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
    Mono.from(db)
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
    Mono.from(db)
        .flatMap(
            c -> Mono.from(c.createStatement(snippetMarkPrimaryQ)
                            .bind(":tlId", tlId)
                            .bind(":snId", snId)
                            .execute())
    	)
        .flatMap(result -> result.getRowsUpdated());
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

private static final String tasksAllQ = """
    SELECT t.id AS "existingId", "taskGroupId", tg.name AS "taskGroupName", t.name, t.description, t."isDeleted"
    FROM sv.task t
    JOIN sv."taskGroup" tg ON tg.id = t."taskGroupId";
""";
public Flux<TaskCUIntern> tasksAll() {
    val deserializer = new Deserializer<TaskCUIntern>();
    Mono.from(db)
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
    Mono.from(db)
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
    val deserializer = new Deserializer<LanguageCU>();
    Mono.from(db)
        .flatMap(
            c -> Mono.from(c.createStatement(taskGroupsForArrayLanguagesQ)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
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
    Mono.from(db)
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
    Mono.from(db)
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
    Mono.from(db)
        .flatMap(
            c -> Mono.from(c.createStatement(logMessageQ)
                            .bind("ts", ts)
                            .bind("msgType", msgType)
                            .bind("code", code.subString(0, Math.min(16, code.length)))
                            .bind("commentId", commentId)
    	))
        .flatMap(result -> result.getRowsUpdated());
}

private static final String proposalUpdateQ = """
    UPDATE sv.snippet SET content = :content, libraries = :libraries
    WHERE id = :snId;
""";
public Mono<Integer> proposalUpdate(ProposalUpdate dto) {
    val newLibraries = dto.libraries != null && dto.libraries.length() > 0 ? dto.libraries : null;
    Mono.from(db)
        .flatMap(
            c -> Mono.from(c.createStatement(proposalUpdateQ)
                            .bind(":snId", dto.existingId)
                            .bind(":content", dto.content)
                            .bind(":libraries", newLibraries)
                            .execute())
    	)
        .flatMap(result -> result.getRowsUpdated());
}

private static final String userCountQ = """
    SELECT COUNT(*) AS Cnt
    FROM sv.user WHERE "isDeleted" = 0::bit;
""";
public Mono<Long> userCount() {
    Mono.from(db)
        .flatMap(
            c -> Mono.from(c.createStatement(userCountQ)
                            .returnGeneratedValues("cnt")
                            .execute())
    	);
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
