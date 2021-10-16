namespace SnippetVault {
    
public record GetQueries {
    public string snippet {get; init;}
    public string language {get; init;}
    public string task {get; init;}
    public string taskGroup {get; init;}
    public string taskGroupsForLanguages {get; init;}
    public string proposal {get; init;}
    public string alternative {get; init;}
    public string comment {get; init;}
}

public class GetPGQueries  {


    public static GetQueries mkGetQueries() {
        return new GetQueries() {
            snippet=@"
                SELECT sn1.id as ""leftId"", sn1.content as ""leftCode"", t.id AS ""taskId"", t.name AS ""taskName"", 
				       sn2.id AS ""rightId"", sn2.content AS ""rightCode""
				FROM snippet.""task"" AS t
				LEFT JOIN snippet.""taskLanguage"" tl1 ON tl1.""taskId""=t.id AND tl1.""languageId""=@l1
				LEFT JOIN snippet.""taskLanguage"" tl2 ON tl2.""taskId""=t.id AND tl2.""languageId""=@l2
				JOIN snippet.language l1 ON l1.id=tl1.""languageId""
				JOIN snippet.language l2 ON l2.id=tl2.""languageId""
				LEFT JOIN snippet.snippet sn1 ON sn1.id=tl1.""primarySnippetId""
				LEFT JOIN snippet.snippet sn2 ON sn2.id=tl2.""primarySnippetId""
				WHERE t.""taskGroupId""=@tg;", 
            language=@"
                SELECT l.id, l.name, lg.name AS ""languageGroup"" FROM snippet.language l
				JOIN snippet.""languageGroup"" lg ON l.""languageGroupId""=lg.id;", 
            task=@"SELECT id, name, description FROM snippet.""task"" WHERE ""taskGroupId""=@1;",
            taskGroup= @"SELECT id, name FROM snippet.""taskGroup"" WHERE ""isDeleted""=0::bit;",
            taskGroupsForLanguages= @"
                SELECT DISTINCT tg.id, tg.name FROM snippet.task t
                JOIN snippet.""taskLanguage"" tl ON tl.""taskId""=t.id
                JOIN snippet.""taskGroup"" tg ON tg.id=t.""taskGroupId""
                WHERE tl.""languageId"" IN (@ls);",
            proposal = @"
                SELECT lang.name AS ""language"", task.name AS ""task"", 
					   sn1.id AS ""proposalId"", sn1.content AS ""proposalCode"", sn1.""tsUpload""
				FROM snippet.snippet sn1
				JOIN snippet.""taskLanguage"" tl ON tl.id=sn1.""taskLanguageId""
				JOIN snippet.task task ON task.id=tl.""taskId""
				JOIN snippet.language lang ON lang.id=tl.""languageId""
				WHERE sn1.""isApproved""=0::bit;",
            alternative = @"
                SELECT sn2.id AS ""primaryId"", sn2.content AS ""primaryCode"", sn2.score AS ""primaryScore"",
					   sn1.id AS ""alternativeId"", sn1.content AS ""alternativeCode"", sn1.score AS ""alternativeScore"", sn1.""tsUpload""
				FROM snippet.snippet sn1
				JOIN snippet.""taskLanguage"" tl ON tl.id=sn1.""taskLanguageId""
				JOIN snippet.snippet sn2 ON sn2.id=tl.""primarySnippetId""
				WHERE sn1.""taskLanguageId""=$1 
				AND sn1.""isApproved""=1::bit AND sn1.id != tl.""primarySnippetId"";",
            comment = @"
                SELECT c.content, c.""tsUpload"", u.id AS ""userId"", u.name AS ""userName""
				FROM snippet.comment c
				JOIN snippet.user u ON u.id=c.""userId""
				WHERE c.""snippetId""=$1;",
            };
    }
}

}