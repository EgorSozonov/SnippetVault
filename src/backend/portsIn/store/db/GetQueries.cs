namespace SnippetVault {
    
    
public record GetQueries {
    public string snippets {get; init;}
    public string snippetsByCode {get; init;}
    public string snippet {get; init;}
    public string languages {get; init;}
    public string languagesGrouped {get; init;}
    public string task {get; init;}
    public string taskGroup {get; init;}
    public string taskGroupsForLanguages {get; init;}
    public string proposals {get; init;}
    public string alternative {get; init;}
    public string comment {get; init;}
    public string userAuthentData {get; init;}
    public string userAuthor {get; init;}
    public string userAdminData {get;init;}
    public string userAdminAuthor {get;init;}
    public string statsForAdmin {get; init;}
}

public class GetPGQueries  {
    public static GetQueries mkGetQueries() {
        return new GetQueries() {
            snippets=@"
                SELECT sn1.id as ""leftId"", sn1.content as ""leftCode"", tl1.id AS ""leftTlId"", 
                       t.id AS ""taskId"", t.name AS ""taskName"", 
				       sn2.id AS ""rightId"", sn2.content AS ""rightCode"", tl2.id AS ""rightTlId""
				FROM sv.""task"" AS t
				LEFT JOIN sv.""taskLanguage"" tl1 ON tl1.""taskId""=t.id AND tl1.""languageId""=@l1
				LEFT JOIN sv.""taskLanguage"" tl2 ON tl2.""taskId""=t.id AND tl2.""languageId""=@l2
				LEFT JOIN sv.language l1 ON l1.id=tl1.""languageId""
				LEFT JOIN sv.language l2 ON l2.id=tl2.""languageId""
				LEFT JOIN sv.snippet sn1 ON sn1.id=tl1.""primarySnippetId""
				LEFT JOIN sv.snippet sn2 ON sn2.id=tl2.""primarySnippetId""
				WHERE t.""taskGroupId""=@tgId;",
            snippetsByCode=@"
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
                SELECT sn1.id as ""leftId"", sn1.content as ""leftCode"", tl1.id AS ""leftTlId"", 
                	   t.id AS ""taskId"", t.name AS ""taskName"", 
                	   sn2.id AS ""rightId"", sn2.content AS ""rightCode"", tl2.id AS ""rightTlId""
                FROM sv.""task"" AS t
                JOIN sv.""taskGroup"" tg ON tg.id=t.""taskGroupId"" AND tg.code=@tgCode
                LEFT JOIN taskLangs1 tl1 ON tl1.""taskId""=t.id
                LEFT JOIN taskLangs2 tl2 ON tl2.""taskId""=t.id
                LEFT JOIN sv.snippet sn1 ON sn1.id=tl1.""primarySnippetId""
                LEFT JOIN sv.snippet sn2 ON sn2.id=tl2.""primarySnippetId"";", 
            snippet=@"
                SELECT s.""taskLanguageId"", s.content, s.status, s.score
				FROM sv.snippet s 				
				WHERE s.id=@snId;",
            languages=@"
                SELECT l.id, l.name AS name, lg.id AS ""lgId"", lg.name AS ""lgName"", l.code AS code
                FROM sv.language l
				JOIN sv.""languageGroup"" lg ON l.""languageGroupId""=lg.id;",
            languagesGrouped=@"
                SELECT l.id, l.name AS name, l.code, lg.name AS ""languageGroup"", lg.""sortingOrder"" AS ""languageGroupOrder""
                FROM sv.language l
				JOIN sv.""languageGroup"" lg ON l.""languageGroupId""=lg.id;",                 
            task=@"SELECT id, name, description FROM sv.""task"" WHERE ""taskGroupId""=@tgId;",
            taskGroup= @"SELECT id, name, code FROM sv.""taskGroup"" WHERE ""isDeleted""=0::bit;",
            taskGroupsForLanguages= @"
                SELECT DISTINCT tg.id, tg.name, tg.code FROM sv.task t
                JOIN sv.""taskLanguage"" tl ON tl.""taskId""=t.id
                JOIN sv.""taskGroup"" tg ON tg.id=t.""taskGroupId""
                WHERE tl.""languageId"" = ANY(@ls);",
            proposals = @"
                SELECT lang.name AS ""languageName"", task.name AS ""taskName"", 
					   sn.id AS ""proposalId"", sn.content AS ""proposalCode"", sn.""tsUpload"", u.name AS author, u.id AS ""authorId""
				FROM sv.snippet sn
				JOIN sv.""taskLanguage"" tl ON tl.id=sn.""taskLanguageId""
				JOIN sv.task task ON task.id=tl.""taskId""
				JOIN sv.language lang ON lang.id=tl.""languageId""
                JOIN sv.user u ON u.id=sn.""authorId""
				WHERE sn.status=1;",
            alternative = @"
                SELECT sn.id, sn.content AS code, sn.""tsUpload"", sn.score
                FROM sv.""taskLanguage"" tl
                JOIN sv.snippet sn ON sn.id=tl.""primarySnippetId""
                WHERE tl.id=@tlId
                UNION ALL 
                SELECT sn.id, sn.content, sn.""tsUpload"", sn.score FROM sv.snippet sn
                WHERE sn.""taskLanguageId""=@tlId;",
            comment = @"
                SELECT c.content, c.""tsUpload"", u.id AS ""userId"", u.name AS ""userName""
				FROM sv.comment c
				JOIN sv.user u ON u.id=c.""userId""
				WHERE c.""snippetId""=@snId;",           
            userAuthentData = @"
                SELECT id AS ""userId"", encode(hash, 'base64') AS hash, encode(salt, 'base64') AS salt, expiration, ""accessToken""
                FROM sv.user WHERE name=@name;
            ",
            userAuthor = @"
                SELECT ""accessToken"", expiration 
                FROM sv.user WHERE id=@id;
            ",
            userAdminData = @"
                SELECT ""accessToken"", expiration 
                FROM sv.user WHERE name='" + AdminPasswordChecker.adminName + "';",
            userAdminAuthor = @"
                SELECT ""accessToken"", expiration 
                FROM sv.user WHERE name=@name;
            ",
            statsForAdmin = @"
                SELECT 
                	SUM(CASE WHEN s.status=3 AND tl.id IS NOT NULL THEN 1 ELSE 0 END) AS ""primaryCount"",
                	SUM(CASE WHEN s.status=3 AND tl.id IS NULL THEN 1 ELSE 0 END) AS ""alternativeCount"",
                	SUM(CASE WHEN s.status=1 THEN 1 ELSE 0 END) AS ""proposalCount""
                FROM sv.snippet s
                LEFT JOIN sv.""taskLanguage"" tl ON tl.""primarySnippetId""=s.id;",
        };
    }
}

}