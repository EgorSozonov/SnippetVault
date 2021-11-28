namespace SnippetVault {


public record PostQueries {
    public string addSnippet {get; init;}
    public string approveSnippet {get; init;}
    public string deleteSnippet {get; init;}
    public string markPrimarySnippet {get; init;}
    public string addComment {get; init;}
    public string deleteComment {get; init;}
    public string vote {get; init;}
    public string addTask {get; init;}
    public string addTaskGroup {get; init;}
    public string addLanguage {get; init;}
    public string addLanguageGroup {get; init;}
    public string cleanSpamProposals {get; init;}
}

public class PostPGQueries  {
    public static PostQueries mkPostQueries() {
        return new PostQueries() {
                addSnippet=@"
                    INSERT INTO sv.snippet(""taskLanguageId"", content, ""isApproved"", score, ""tsUpload"")
                    VALUES (@tl, @content, 0::bit, 0, @ts);", 
                approveSnippet=@"
                    UPDATE sv.snippet
                    SET ""isApproved""=1::bit 
                    WHERE id=@sn;",
                deleteSnippet=@"DELETE FROM sv.snippet WHERE id=@sn;",
                markPrimarySnippet=@"UPDATE sv.""taskLanguage"" SET ""primarySnippetId""=@sn WHERE id=@tl;",
                addTask=@"INSERT INTO sv.task(name, ""taskGroupId"", description) VALUES (@name, @tgId, @description);",
                addTaskGroup=@"INSERT INTO sv.""taskGroup""(name, ""isDeleted"") VALUES (@name, 0::bit);",
                addLanguage=@"INSERT INTO sv.language(code, name, ""isDeleted"", ""languageGroupId"") VALUES (@code, @name, 0::bit, @lgId);",
                addLanguageGroup=@"INSERT INTO sv.""languageGroup""(code, name) VALUES (@code, @name);",
                addComment=@"
                    INSERT INTO sv.comment(""userId"", ""snippetId"", content, ""dateComment"")
                    VALUES (@user, @sn, @content, @ts);",
                deleteComment=@"DELETE FROM sv.comment WHERE id=@comment;",
                vote=@"
                    BEGIN;
                    WITH existingVote AS (
                        SELECT uv.""snippetId"" FROM sv.""userVote"" uv 
                        WHERE uv.""userId""=@user AND uv.""taskLanguageId""=1 AND uv.""snippetId""<>@sn LIMIT 1
                    )
                    UPDATE sv.snippet SET score=score-1 WHERE id IN (SELECT ""snippetId"" FROM existingVote);
                    
                    INSERT INTO sv.""userVote""(""userId"", ""taskLanguageId"", ""snippetId"")
                    VALUES (@user, @tl, @sn) 
                    ON CONFLICT(""userId"", ""taskLanguageId"") 
                    DO UPDATE SET ""snippetId""=EXCLUDED.""snippetId"";

                    UPDATE sv.snippet 
                    SET score=score + 1 WHERE id=@sn;  
                    
                    COMMIT;
                    ",
                cleanSpamProposals=@"",
            };
    }
}

}
