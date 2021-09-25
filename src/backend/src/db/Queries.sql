SELECT sn1.content, t.name, sn2.content FROM snippet."task" AS t
LEFT JOIN snippet."taskLanguage" tl1 ON tl1."taskId"=t.id AND tl1."languageId"=1
LEFT JOIN snippet."taskLanguage" tl2 ON tl2."taskId"=t.id AND tl2."languageId"=1
LEFT JOIN snippet.snippet sn1 ON sn1.id=tl1."primarySnippetId"
LEFT JOIN snippet.snippet sn2 ON sn2.id=tl2."primarySnippetId"
WHERE t."taskGroupId"=3
  AND tl1."languageId"=1
  AND tl2."languageId"=0;
  
  
-- Snippets list
SELECT l1.name, sn1.content, t.name, l2.name, sn2.content FROM snippet."task" AS t
LEFT JOIN snippet."taskLanguage" tl1 ON tl1."taskId"=t.id AND tl1."languageId"=0
LEFT JOIN snippet."taskLanguage" tl2 ON tl2."taskId"=t.id AND tl2."languageId"=11
JOIN snippet.language l1 ON l1.id=tl1."languageId"
JOIN snippet.language l2 ON l2.id=tl2."languageId"
LEFT JOIN snippet.snippet sn1 ON sn1.id=tl1."primarySnippetId"
LEFT JOIN snippet.snippet sn2 ON sn2.id=tl2."primarySnippetId"
WHERE t."taskGroupId"=3;



-- POST QUERIES
-- 1. New snippet
INSERT INTO snippet.snippet("taskLanguageId", content, "isApproved", score)
VALUES (?, ?, 0, 0);


-- 2. Approve/delete snippet
UPDATE snippet.snippet
SET "isApproved"=1::bit 
WHERE id=?;

DELETE FROM snippet.snippet 
WHERE id=?;


-- 3. Change primary snippet
UPDATE snippet."taskLanguage"
SET "primarySnippetId"=? WHERE id=?;


-- 4. Add/delete comment
INSERT INTO snippet.comment("userId", "snippetId", content, "dateComment")
VALUES (?, ?, ?, ?);

DELETE FROM snippet.comment 
WHERE id=?;


-- 5. Vote/change vote
INSERT INTO snippet."userVote"("userId", "taskLanguageId", "snippetId")
VALUES (?, ?, ?) 
ON CONFLICT("userId", "taskLanguageId") 
	DO UPDATE SET "snippetId"=EXCLUDED."snippetId";

UPDATE snippet.snippet 
SET score=score-1 WHERE id=?;

UPDATE snippet.snippet 
SET score=score+1 WHERE id=?;


-- 6. Add/edit task
INSERT INTO snippet.task(name, "taskGroupId") VALUES (?, ?);


-- 7. Add/edit task group
INSERT INTO snippet."taskGroup"(name, "isDeleted") VALUES (?, 0::bit);


-- 8. Add/edit language
INSERT INTO snippet.language(code, name, "isDeleted", "languageGroupId") VALUES (?, ?, 0::bit, ?);


-- 9. Add/edit language group
INSERT INTO snippet."languageGroup"(code, name) VALUES (?, ?);


-- GET QUERIES
-- 1. Language list
SELECT l.code, l.name, lg.name AS "languageGroup" FROM snippet.language l
JOIN snippet."languageGroup" lg ON l."languageGroupId"=lg.id;

-- 2. Task group list
SELECT id, name FROM snippet."taskGroup" WHERE "isDeleted"=0::bit;

-- 3. Task list (taskGroupId)
SELECT id, name, description FROM snippet."task" WHERE "taskGroupId"=1;

-- 4. Snippets
SELECT sn1.id as "leftId", sn1.content as "leftCode", t.id AS "taskId", t.name AS "taskName", 
       sn2.id AS "rightId", sn2.content AS "rightCode"
FROM snippet."task" AS t
LEFT JOIN snippet."taskLanguage" tl1 ON tl1."taskId"=t.id AND tl1."languageId"=0
LEFT JOIN snippet."taskLanguage" tl2 ON tl2."taskId"=t.id AND tl2."languageId"=11
JOIN snippet.language l1 ON l1.id=tl1."languageId"
JOIN snippet.language l2 ON l2.id=tl2."languageId"
LEFT JOIN snippet.snippet sn1 ON sn1.id=tl1."primarySnippetId"
LEFT JOIN snippet.snippet sn2 ON sn2.id=tl2."primarySnippetId"
WHERE t."taskGroupId"=3;

-- 5. Alternatives (taskLanguageId)
SELECT sn2.id AS "primaryId", sn2.content AS "primaryCode",
	   sn1.id AS "alternativeId", sn1.content AS "alternativeCode", sn1.score, sn1."tsUpload"
FROM snippet.snippet sn1
JOIN snippet."taskLanguage" tl ON tl.id=sn1."taskLanguageId"
JOIN snippet.snippet sn2 ON sn2.id=tl."primarySnippetId"
WHERE sn1."taskLanguageId"=1 
  AND sn1."isApproved"=1::bit AND sn1.id != tl."primarySnippetId";

-- 6. Fresh proposals for premoderation 
SELECT lang.name AS "language", task.name AS "task", 
	   sn1.id AS "proposalId", sn1.content AS "proposalCode", sn1."tsUpload"
FROM snippet.snippet sn1
JOIN snippet."taskLanguage" tl ON tl.id=sn1."taskLanguageId"
JOIN snippet.task task ON task.id=tl."taskId"
JOIN snippet.language lang ON lang.id=tl."languageId"
WHERE sn1."isApproved"=0::bit;

-- 7. Comments (snippetId)
SELECT c.content, c."tsUpload", u.id AS "userId", u.name AS "userName"
FROM snippet.comment c
JOIN snippet.user u ON u.id=c."userId"
WHERE c."snippetId"=1;