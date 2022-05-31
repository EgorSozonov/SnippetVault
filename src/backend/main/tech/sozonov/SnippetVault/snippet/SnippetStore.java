package tech.sozonov.SnippetVault.snippet;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Service;
import lombok.val;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.cmn.dto.CommonDTO.TaskGroup;
import tech.sozonov.SnippetVault.cmn.internal.InternalTypes.SnippetIntern;
import tech.sozonov.SnippetVault.cmn.utils.Deserializer;
import tech.sozonov.SnippetVault.snippet.SnippetDTO.*;

@Service
public class SnippetStore implements ISnippetStore {


private DatabaseClient db;

@Autowired
public SnippetStore(DatabaseClient _db) {
    db = _db;
}

private static final String languagesGetQ = """
    SELECT l.id, l.name, l."sortingOrder", l.code
    FROM sv.language l
    WHERE l."isDeleted" = 0::bit;
""";
public Flux<Language> languagesGet() {
    val deserializer = new Deserializer<>(Language.class, languagesGetQ);
    return db.sql(languagesGetQ)
             .map(deserializer::unpackRow)
             .all();
}

private static final String taskGroupsGetQ = """
    SELECT id, name, code FROM sv."taskGroup"
    WHERE "isDeleted"=0::bit;
""";
public Flux<TaskGroup> taskGroupsGet() {
    val deserializer = new Deserializer<>(TaskGroup.class, taskGroupsGetQ);
    return db.sql(taskGroupsGetQ)
             .map(deserializer::unpackRow)
             .all();
}

private static final String snippetsQ = """
    SELECT sn1.id as "leftId", sn1.content as "leftCode", tl1.id AS "leftTlId", sn1.libraries as "leftLibraries",
           t.id AS "taskId", t.name AS "taskName",
	       sn2.id AS "rightId", sn2.content AS "rightCode", tl2.id AS "rightTlId", sn2.libraries as "rightLibraries"
	FROM sv."task" AS t
	LEFT JOIN sv."taskLanguage" tl1 ON tl1."taskId"=t.id AND tl1."languageId"=$1
	LEFT JOIN sv."taskLanguage" tl2 ON tl2."taskId"=t.id AND tl2."languageId"=$2
	LEFT JOIN sv.language l1 ON l1.id=tl1."languageId"
	LEFT JOIN sv.language l2 ON l2.id=tl2."languageId"
	LEFT JOIN sv.snippet sn1 ON sn1.id=tl1."primarySnippetId"
	LEFT JOIN sv.snippet sn2 ON sn2.id=tl2."primarySnippetId"
	WHERE t."taskGroupId"=$3 AND t."isDeleted"=0::bit
""";
public Flux<Snippet> snippetsGet(int taskGroup, int lang1, int lang2) {
    val deserializer = new Deserializer<>(Snippet.class, snippetsQ);
    return db.sql(snippetsQ)
             .bind("$1", lang1)
             .bind("$2", lang1)
             .bind("$3", taskGroup)
             .map(deserializer::unpackRow)
             .all();
}

private static final String snippetsGetByCodeQ = """
    WITH taskLangs1 AS (
    	SELECT tl.id, tl."taskId", l.id AS "languageId", "primarySnippetId"
    	FROM sv."taskLanguage" tl
    	JOIN sv.language l ON l.id=tl."languageId"
    	WHERE code=$1
    ),
    taskLangs2 AS (
    	SELECT tl.id, tl."taskId", l.id AS "languageId", "primarySnippetId"
    	FROM sv."taskLanguage" tl
    	JOIN sv.language l ON l.id=tl."languageId"
    	WHERE code=$2
    )
    SELECT sn1.id as "leftId", sn1.content as "leftCode", tl1.id AS "leftTlId", sn1.libraries as "leftLibraries",
    	   t.id AS "taskId", t.name AS "taskName",
    	   sn2.id AS "rightId", sn2.content AS "rightCode", tl2.id AS "rightTlId", sn2.libraries as "rightLibraries"
    FROM sv."task" AS t
    JOIN sv."taskGroup" tg ON tg.id=t."taskGroupId" AND tg.code=$3
    LEFT JOIN taskLangs1 tl1 ON tl1."taskId"=t.id
    LEFT JOIN taskLangs2 tl2 ON tl2."taskId"=t.id
    LEFT JOIN sv.snippet sn1 ON sn1.id=tl1."primarySnippetId"
    LEFT JOIN sv.snippet sn2 ON sn2.id=tl2."primarySnippetId"
    WHERE t."isDeleted"=0::bit
""";
public Flux<Snippet> snippetsGetByCode(String taskGroup, String lang1, String lang2) {
    val deserializer = new Deserializer<>(Snippet.class, snippetsGetByCodeQ);
    return db.sql(snippetsGetByCodeQ)
             .bind("$1", lang1)
             .bind("$2", lang1)
             .bind("$3", taskGroup)
             .map(deserializer::unpackRow)
             .all();
}

private static final String snippetGetQ = """
SELECT "taskLanguageId", "status", content, score, libraries
FROM sv.snippet s
WHERE id = $1;
""";
public Mono<SnippetIntern> snippetGet(int snId) {
    val deserializer = new Deserializer<>(SnippetIntern.class, snippetGetQ);
    return db.sql(snippetGetQ)
             .bind("$1", snId)
             .map(deserializer::unpackRow)
             .first();
}

private static final String proposalsGetQ = """
    SELECT sn.id AS "proposalId", sn.content, u.id AS "authorId", u.name AS author,
           task.name AS "taskName", lang.name AS "languageName",
		   sn."tsUpload", sn.libraries
	FROM sv.snippet sn
	JOIN sv."taskLanguage" tl ON tl.id=sn."taskLanguageId"
	JOIN sv.task task ON task.id=tl."taskId"
	JOIN sv.language lang ON lang.id=tl."languageId"
    JOIN sv.user u ON u.id=sn."authorId"
	WHERE sn.status=1 AND lang."isDeleted"=0::bit AND task."isDeleted"=0::bit
""";
public Flux<Proposal> proposalsGet() {
    val deserializer = new Deserializer<>(Proposal.class, proposalsGetQ);
    return db.sql(proposalsGetQ)
             .map(deserializer::unpackRow)
             .all();
}

public Flux<TaskGroup> taskGroupsForLangGet(int langId) {
    return taskGroupsForArrayLanguages(new Integer[] {langId});
}

public Flux<TaskGroup> taskGroupsForLangsGet(int lang1, int lang2) {
    return taskGroupsForArrayLanguages(new Integer[] {lang1, lang2});
}

private static final String taskGroupsForArrayLanguagesQ = """
    SELECT DISTINCT tg.id, tg.name, tg.code FROM sv.task t
    JOIN sv."taskLanguage" tl ON tl."taskId"=t.id
    JOIN sv."taskGroup" tg ON tg.id=t."taskGroupId"
    WHERE tl."languageId" = ANY($1)
""";
private Flux<TaskGroup> taskGroupsForArrayLanguages(Integer[] langs) {
    val deserializer = new Deserializer<>(TaskGroup.class, taskGroupsForArrayLanguagesQ);
    return db.sql(taskGroupsForArrayLanguagesQ)
             .bind("$1", langs)
             .map(deserializer::unpackRow)
             .all();
}

private static final String alternativesForTLGetQ = """
    SELECT sn.id, sn.content AS content, sn."tsUpload", sn.score, COUNT(c.id) AS "commentCount",
    FALSE AS "voteFlag", sn.libraries
    FROM sv."taskLanguage" tl
    JOIN sv.snippet sn ON sn.id=tl."primarySnippetId"
    LEFT JOIN sv.comment c ON c."snippetId" = sn.id
    WHERE tl.id=$1
    GROUP BY sn.id, sn.content, sn."tsUpload", sn.score

    UNION ALL

    SELECT sn.id, sn.content, sn."tsUpload", sn.score, COUNT(c.id) AS "commentCount",
    FALSE AS "voteFlag", sn.libraries
    FROM sv.snippet sn
    LEFT JOIN sv.comment c ON c."snippetId" = sn.id
    WHERE sn."taskLanguageId" = $1 AND sn.status = 3
    GROUP BY sn.id, sn.content, sn."tsUpload", sn.score
""";
public Flux<Alternative> alternativesForTLGet(int taskLanguageId) {
    val deserializer = new Deserializer<>(Alternative.class, alternativesForTLGetQ);
    System.out.println(deserializer.isOK);
    return db.sql(alternativesForTLGetQ)
             .bind("$1", taskLanguageId)
             .map(deserializer::unpackRow)
             .all();
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
    val deserializer = new Deserializer<>(Alternative.class, alternativesForUserGetQ);
    return db.sql(alternativesForUserGetQ)
             .bind("tlId", taskLanguageId)
             .bind("userId", userId)
             .map(deserializer::unpackRow)
             .all();
}

private static final String taskGetQ = """
    SELECT t.id AS "id", t.name AS "name", tg.name AS "taskGroupName", t.description AS "description" FROM sv."task" t
    JOIN sv."taskGroup" tg ON tg.id = t."taskGroupId"
    WHERE t.id = $1
""";
public Mono<Task> taskGet(int taskId) {
    val deserializer = new Deserializer<>(Task.class, taskGetQ);
    System.out.println(deserializer.isOK);
    return db.sql(taskGetQ)
             .bind("$1", taskId)
             .map(deserializer::unpackRow)
             .first();
}

private static final String taskForTLGetQ = """
    SELECT t.id, tg.name AS "taskGroupName", t.name, t.description FROM sv."taskLanguage" tl
    JOIN sv.task t ON t.id=tl."taskId"
    JOIN sv."taskGroup" tg ON tg.id=t."taskGroupId"
    WHERE tl.id = :tlId AND t."isDeleted" = 0::bit
""";
public Mono<Task> taskForTLGet(int tlId) {
    val deserializer = new Deserializer<>(Task.class, taskForTLGetQ);
    return db.sql(taskForTLGetQ)
        .bind("tlId", tlId)
        .map(deserializer::unpackRow)
        .one();
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
    return db.sql(taskLanguageCreateQ)
             .bind("taskId", dto.taskId)
             .bind("langId", dto.langId)
             .fetch()
             .first()
             .map(r -> (int) r.get("id"))
             .flatMap(tlId -> {
                return db.sql(proposalCreateQ)
                         .bind("tlId", tlId)
                         .bind("content", dto.content)
                         .bind("libraries", dto.libraries)
                         .bind("ts", LocalDateTime.now())
                         .bind("authorId", authorId)
                         .fetch()
                         .rowsUpdated();
             });
}


}
