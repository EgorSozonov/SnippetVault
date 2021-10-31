const GetQueries = {
    snippet: `
        SELECT sn1.id as "leftId", sn1.content as "leftCode", t.id AS "taskId", t.name AS "taskName", 
		       sn2.id AS "rightId", sn2.content AS "rightCode"
		FROM sv."task" AS t
		LEFT JOIN sv."taskLanguage" tl1 ON tl1."taskId"=t.id AND tl1."languageId"=$l1
		LEFT JOIN sv."taskLanguage" tl2 ON tl2."taskId"=t.id AND tl2."languageId"=$l2
		JOIN sv.language l1 ON l1.id=tl1."languageId"
		JOIN sv.language l2 ON l2.id=tl2."languageId"
		LEFT JOIN sv.snippet sn1 ON sn1.id=tl1."primarySnippetId"
		LEFT JOIN sv.snippet sn2 ON sn2.id=tl2."primarySnippetId"
		WHERE t."taskGroupId"=$tg;`, 
    language: `
        SELECT l.id, l.name AS name, lg.name AS "languageGroup" FROM sv.language l
		JOIN sv."languageGroup" lg ON l."languageGroupId"=lg.id;`, 
    task: `
        SELECT id, name, description FROM sv."task" WHERE "taskGroupId"=$tg;",
        taskGroup= $"SELECT id, name FROM sv."taskGroup" WHERE "isDeleted"=0::bit;`,
    taskGroupsForLanguages: `
        SELECT DISTINCT tg.id, tg.name FROM sv.task t
        JOIN sv."taskLanguage" tl ON tl."taskId"=t.id
        JOIN sv."taskGroup" tg ON tg.id=t."taskGroupId"
        WHERE tl."languageId" = ANY($ls);`,
    proposal: `
        SELECT lang.name AS "language", task.name AS "task", 
			   sn1.id AS "proposalId", sn1.content AS "proposalCode", sn1."tsUpload"
		FROM sv.snippet sn1
		JOIN sv."taskLanguage" tl ON tl.id=sn1."taskLanguageId"
		JOIN sv.task task ON task.id=tl."taskId"
		JOIN sv.language lang ON lang.id=tl."languageId"
		WHERE sn1."isApproved"=0::bit;`,
    alternative: `
        SELECT sn2.id AS "primaryId", sn2.content AS "primaryCode", sn2.score AS "primaryScore",
			   sn1.id AS "alternativeId", sn1.content AS "alternativeCode", sn1.score AS "alternativeScore", sn1."tsUpload"
		FROM sv.snippet sn1
		JOIN sv."taskLanguage" tl ON tl.id=sn1."taskLanguageId"
		JOIN sv.snippet sn2 ON sn2.id=tl."primarySnippetId"
		WHERE sn1."taskLanguageId"=$tl 
		AND sn1."isApproved"=1::bit AND sn1.id != tl."primarySnippetId";`,
    comment: `
        SELECT c.content, c."tsUpload", u.id AS "userId", u.name AS "userName"
    	FROM sv.comment c
    	JOIN sv.user u ON u.id=c."userId"
    	WHERE c."snippetId"=$sn;`,            
}

export default GetQueries