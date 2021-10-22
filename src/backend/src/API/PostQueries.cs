namespace SnippetVault {


public record PostQueries {
    public string addSnippet {get; init;}
    public string approveSnippet {get; init;}
    public string deleteSnippet {get; init;}
    public string setPrimarySnippet {get; init;}
    public string addComment {get; init;}
    public string deleteComment {get; init;}
    public string vote {get; init;}
    public string addTask {get; init;}
    public string addTaskGroup {get; init;}
    public string addLanguage {get; init;}
    public string addLanguageGroup {get; init;}
}

public class PostPGQueries  {


    public static PostQueries mkPostQueries() {
        return new PostQueries() {
                addSnippet=@"
                    INSERT INTO snippet.snippet(""taskLanguageId"", content, ""isApproved"", score)
                    VALUES (?, ?, 0, 0);", 
                approveSnippet=@"
                    UPDATE snippet.snippet
                    SET ""isApproved""=1::bit 
                    WHERE id=?;",
                deleteSnippet=@"DELETE FROM snippet.snippet WHERE id=?;",
                setPrimarySnippet=@"UPDATE snippet.""taskLanguage"" SET ""primarySnippetId""=? WHERE id=?;",
                addComment=@"
                    INSERT INTO snippet.comment(""userId"", ""snippetId"", content, ""dateComment"")
                    VALUES (?, ?, ?, ?);",
                deleteComment=@"DELETE FROM snippet.comment WHERE id=?;",
                vote=@"
                    INSERT INTO snippet.""userVote""(""userId"", ""taskLanguageId"", ""snippetId"")
                    VALUES (@uId, @tlId, @snId) 
                    ON CONFLICT(""userId"", ""taskLanguageId"") 
	                DO UPDATE SET ""snippetId""=EXCLUDED.""snippetId"";

                    UPDATE snippet.snippet 
                    SET score=score - 1 WHERE id=???;

                    UPDATE snippet.snippet 
                    SET score=score + 1 WHERE id=@snId;",
                addTask=@"INSERT INTO snippet.task(name, ""taskGroupId"") VALUES (@nm, @tgId);",
                addTaskGroup=@"INSERT INTO snippet.""taskGroup""(name, ""isDeleted"") VALUES (@nm, 0::bit);",
                addLanguage=@"INSERT INTO snippet.language(code, name, ""isDeleted"", ""languageGroupId"") VALUES (@c, @nm, 0::bit, @lgId);",
                addLanguageGroup=@"INSERT INTO snippet.""languageGroup""(code, name) VALUES (?, ?);",
            
            };
    }
}

}