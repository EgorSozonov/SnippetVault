package tech.sozonov.SnippetVault.admin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.DatabaseClient.GenericExecuteSpec;
import org.springframework.stereotype.Component;
import lombok.val;
import java.time.LocalDateTime;
import java.util.function.BiFunction;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import tech.sozonov.SnippetVault.admin.AdminDTO.*;
import tech.sozonov.SnippetVault.cmn.utils.Deserializer;
import tech.sozonov.SnippetVault.cmn.internal.InternalTypes.TaskCUIntern;
import static tech.sozonov.SnippetVault.cmn.utils.DB.*;

@Component
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
public Mono<Integer> snippetApprove(int snId) {
    return db.sql(snippetApproveQ)
             .bind("snId", snId)
             .fetch()
             .rowsUpdated();
}

private static final String snippetDeclineQ = """
    UPDATE sv.snippet SET status=2 WHERE id = :snId;
""";
public Mono<Integer> snippetDecline(int snId) {
    return db.sql(snippetDeclineQ)
             .bind("snId", snId)
             .fetch()
             .rowsUpdated();
}

private static final String snippetMarkPrimaryQ = """
    UPDATE sv."taskLanguage" SET "primarySnippetId" = :snId WHERE id=:tlId;
""";
public Mono<Integer> snippetMarkPrimary(int tlId, int snId) {
    return db.sql(snippetMarkPrimaryQ)
             .bind("tlId", tlId)
             .bind("snId", snId)
             .fetch()
             .rowsUpdated();
}



private static final String taskGroupCreateQ = """
    INSERT INTO sv."taskGroup"(name, code, "isDeleted") VALUES (:name, :code, 0::bit);
""";
private static final String taskGroupUpdateQ = """
    UPDATE sv."taskGroup" SET name=:name, "isDeleted" = :isDeleted
    WHERE id=:existingId;
""";
public Mono<Integer> taskGroupCU(TaskGroupCU dto) {
    BiFunction<GenericExecuteSpec, TaskGroupCU, GenericExecuteSpec> binder =
        (cmd, x) -> cmd.bind("name", x.name)
                       .bind("code", x.code)
                       .bind("isDeleted", x.isDeleted);
    return createOrUpdate(taskGroupCreateQ, taskGroupUpdateQ, binder, dto, db);
}

private static final String tasksAllQ = """
    SELECT t.id AS "existingId", "taskGroupId", tg.name AS "taskGroupName", t.name, t.description, t."isDeleted"
    FROM sv.task t
    JOIN sv."taskGroup" tg ON tg.id = t."taskGroupId"
""";
public Flux<TaskCUIntern> tasksAll() {
    val deserializer = new Deserializer<>(TaskCUIntern.class, tasksAllQ);
    System.out.println(deserializer.isOK);


    return db.sql(deserializer.sqlSelectQuery)
             .map(deserializer::unpackRow)
             .all()
             .map(x -> {
                 System.out.println(x.name);
                 return x;
             });
}

private static final String taskGroupsAllQ = """
    SELECT id AS "existingId", code, name, "isDeleted"
    FROM sv."taskGroup";
""";
public Flux<TaskGroupCU> taskGroupsAll() {
    val deserializer = new Deserializer<>(TaskGroupCU.class, taskGroupsAllQ);
    return db.sql(taskGroupsAllQ)
             .map(deserializer::unpackRow)
             .all();
}

private static final String languagesAllQ = """
    SELECT id AS "existingId", code, name, "sortingOrder", "isDeleted"
    FROM sv.language;
""";
public Flux<LanguageCU> languagesAll() {
    val deserializer = new Deserializer<>(LanguageCU.class, languagesAllQ);
    return db.sql(languagesAllQ)
             .map(deserializer::unpackRow)
             .all();
}

private static final String taskCreateQ = """
    INSERT INTO sv.task(name, "taskGroupId", description) VALUES (:name, :tgId, :description);
"""; // TODO check for isDeleted
private static final String taskUpdateQ = """
    UPDATE sv.task SET name=:name, "taskGroupId"=:tgId, description=:description
    WHERE id=:existingId;
"""; // TODO check for isDeleted
public Mono<Integer> taskCU(TaskCU dto) {
    BiFunction<GenericExecuteSpec, TaskCU, GenericExecuteSpec> binder =
        (cmd, x) -> cmd.bind("name", x.name)
                       .bind("description", x.description)
                       .bind("taskId", x.taskGroup.id);
    return createOrUpdate(taskCreateQ, taskUpdateQ, binder, dto, db);
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
    BiFunction<GenericExecuteSpec, LanguageCU, GenericExecuteSpec> binder =
        (cmd, x) -> cmd.bind("name", dto.name)
                        .bind("code", dto.code)
                        .bind("sortingOrder", dto.sortingOrder)
                        .bind("isDeleted", dto.isDeleted);
    return createOrUpdate(languageCreateQ, languageUpdateQ, binder, dto, db);
}

private static final String statsForAdminQ = """
    SELECT
    	SUM(CASE WHEN s.status=3 AND tl.id IS NOT NULL THEN 1 ELSE 0 END) AS "primaryCount",
    	SUM(CASE WHEN s.status=3 AND tl.id IS NULL THEN 1 ELSE 0 END) AS "alternativeCount",
    	SUM(CASE WHEN s.status != 1 THEN 1 ELSE 0 END) AS "proposalCount",
        (SELECT COUNT(*) FROM sv.user WHERE "isDeleted" = false) AS "userCount"
    FROM sv.snippet s
    LEFT JOIN sv."taskLanguage" tl ON tl."primarySnippetId"=s.id;
""";

public Mono<Stats> statsForAdmin() {
    val deserializer = new Deserializer<>(Stats.class, statsForAdminQ);
    System.out.println("statsForAdmin " + deserializer.isOK);

    return db.sql(deserializer.sqlSelectQuery)
             .map(deserializer::unpackRow)
             .one();
}

private static final String logMessageQ = """
    INSERT INTO sv.log(ts, type, code, msg)
    VALUES (:ts, :msgType, :code, :message);
""";
public Mono<Integer> logMessage(LocalDateTime ts, int msgType, String code, String message) {
    return db.sql(logMessageQ)
             .bind("ts", ts)
             .bind("msgType", msgType)
             .bind("code", code.substring(0, Math.min(16, code.length())))
             .bind("message", message)
             .fetch()
             .rowsUpdated();
}

private static final String proposalUpdateQ = """
    UPDATE sv.snippet SET content = :content, libraries = :libraries
    WHERE id = :snId;
""";
public Mono<Integer> proposalUpdate(ProposalUpdate dto) {
    val newLibraries = dto.libraries != null && dto.libraries.length() > 0 ? dto.libraries : null;
    return db.sql(proposalUpdateQ)
             .bind("snId", dto.existingId)
             .bind("content", dto.content)
             .bind("libraries", newLibraries)
             .fetch()
             .rowsUpdated();
}


}
