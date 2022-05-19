package tech.sozonov.SnippetVault.snippet;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.val;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.netty.Connection;
import tech.sozonov.SnippetVault.cmn.dto.CommonDTO.TaskGroup;
import tech.sozonov.SnippetVault.cmn.internal.InternalTypes.SnippetIntern;
import tech.sozonov.SnippetVault.cmn.utils.Deserializer;
import tech.sozonov.SnippetVault.snippet.SnippetDTO.*;

public class SnippetStore {


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
    val deserializer = new Deserializer<Language>();
    Mono.from(db)
        .flatMap(
            c -> Mono.from(c.createStatement(languagesGetQ)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
}

private static final String taskGroupsGetQ = """
    SELECT id, name, code FROM sv."taskGroup"
    WHERE "isDeleted"=0::bit;
""";
public Flux<TaskGroup> taskGroupsGet() {
    val deserializer = new Deserializer<TaskGroup>();
    Mono.from(db)
        .flatMap(
            c -> Mono.from(c.createStatement(taskGroupsGetQ)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
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
    Mono.from(db)
        .flatMap(
            c -> Mono.from(c.createStatement(snippetsQ)
                            .bind("l1", lang1)
                            .bind("l2", lang1)
                            .bind("tgId", taskGroup)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
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
    Mono.from(db)
        .flatMap(
            c -> Mono.from(c.createStatement(snippetsGetByCodeQ)
                            .bind(":l1Code", lang1)
                            .bind(":l2Code", lang1)
                            .bind(":tgId", taskGroup)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
}


private static final String snippetGetQ = """
    SELECT "taskLanguageId", "status", content, score, libraries
	FROM sv.snippet s
	WHERE id = :snId;
""";
public Mono<SnippetIntern> snippetGet(int snId) {
    val deserializer = new Deserializer<SnippetIntern>();
    Mono.from(db)
        .flatMap(
            c -> Mono.from(c.createStatement(snippetGetQ)
                            .bind(":snId", snId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
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
    Mono.from(db)
        .flatMap(
            c -> Mono.from(c.createStatement(proposalsGetQ)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
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
    Mono.from(db)
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
    Mono.from(db)
        .flatMap(
            c -> Mono.from(c.createStatement(alternativesForUserGetQ)
                            .bind("tlId", taskLanguageId)
                            .bind("userId", userId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
}

private static final String taskGetQ = """
    SELECT t.id, tg.name AS "taskGroupName", t.name, t.description FROM sv."task" t
    JOIN sv."taskGroup" tg ON tg.id=t."taskGroupId"
    WHERE t.id = :taskId;
""";
public Mono<Task> taskGet(int taskId) {
    val deserializer = new Deserializer<Task>();
    Mono.from(db)
        .flatMap(
            c -> Mono.from(c.createStatement(taskGetQ)
                            .bind("taskId", taskId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
}

private static final String taskForTLGetQ = """
    SELECT t.id, tg.name AS "taskGroupName", t.name, t.description FROM sv."taskLanguage" tl
    JOIN sv.task t ON t.id=tl."taskId"
    JOIN sv."taskGroup" tg ON tg.id=t."taskGroupId"
    WHERE tl.id = :tlId AND t."isDeleted" = 0::bit;
""";
public Mono<Task> taskForTLGet(int tlId) {
    val deserializer = new Deserializer<Task>();
    Mono.from(db)
        .flatMap(
            c -> Mono.from(c.createStatement(taskForTLGetQ)
                            .bind("tlId", tlId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
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
    Mono.from(db)
        .flatMap(
            c -> Mono.from(c.createStatement(taskLanguageCreateQ)
                            .bind(":taskId", dto.taskId)
                            .bind(":langId", dto.langId)
                            .returnGeneratedValues("id")
                            .execute())
    	)
        .flatMap(tlId -> {
            Mono.from(db)
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


}
