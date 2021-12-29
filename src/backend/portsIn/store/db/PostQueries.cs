namespace SnippetVault {


public record PostQueries {
    public string proposalCreate {get; init;}
    public string taskLanguageCreate {get; init;}    
    public string approveProposal {get; init;}
    public string deleteSnippet {get; init;}
    public string markPrimarySnippet {get; init;}
    public string addComment {get; init;}
    public string deleteComment {get; init;}
    public string vote {get; init;}
    public string taskCreate {get; init;}
    public string taskUpdate {get; init;}
    public string taskGroupCreate {get; init;}
    public string taskGroupUpdate {get; init;}
    public string languageCreate {get; init;}
    public string languageUpdate {get; init;}
    public string languageGroupCreate {get; init;}
    public string languageGroupUpdate {get; init;}
    public string userRegister {get; init;}
    public string userUpdateExpiration {get; init;}
    public string userSignIn {get; init;}
    public string cleanSpamProposals {get; init;}
}

public class PostPGQueries  {
    public static PostQueries mkPostQueries() {
        return new PostQueries() {

                proposalCreate=@"                  
                    INSERT INTO sv.snippet(""taskLanguageId"", content, ""isApproved"", score, ""tsUpload"", ""authorId"")
                    VALUES (@tlId, @content, 0::bit, 0, @ts, @authorId);", 
                taskLanguageCreate=@"
                    INSERT INTO sv.""taskLanguage""(""taskId"", ""languageId"", ""primarySnippetId"")
                    	VALUES (@taskId, @langId, NULL)
                    ON CONFLICT (""taskId"", ""languageId"") DO UPDATE SET ""languageId""=@langId
                    RETURNING id;",
                approveProposal=@"
                    UPDATE sv.snippet
                    SET ""isApproved""=1::bit 
                    WHERE id=@snId;",
                deleteSnippet=@"DELETE FROM sv.snippet WHERE id=@snId;",
                markPrimarySnippet=@"UPDATE sv.""taskLanguage"" SET ""primarySnippetId""=@snId WHERE id=@tlId AND ""isDeleted""=0::bit;",
                taskCreate=@"INSERT INTO sv.task(name, ""taskGroupId"", description) VALUES (@name, @tgId, @description);",  // TODO check for isDeleted
                taskUpdate=@"UPDATE sv.task SET name=@name, ""taskGroupId""=@tgId, description=@description
                WHERE id=@existingId;",  // TODO check for isDeleted
                taskGroupCreate=@"INSERT INTO sv.""taskGroup""(name, code, ""isDeleted"") VALUES (@name, @code, 0::bit);",
                taskGroupUpdate=@"UPDATE sv.""taskGroup"" SET name=@name, ""isDeleted""=@isDeleted
                WHERE id=@existingId;",
                languageCreate=@"INSERT INTO sv.language(code, name, ""isDeleted"", ""languageGroupId"") VALUES (@code, @name, 0::bit, @lgId);",
                languageUpdate=@"UPDATE sv.language SET code=@code, name=@name, 
                ""isDeleted""=@isDeleted, ""languageGroupId""=@lgId 
                WHERE id=@existingId;",
                languageGroupCreate=@"INSERT INTO sv.""languageGroup""(code, name, ""sortingOrder"") 
                VALUES (@code, @name, @sortingOrder);",
                languageGroupUpdate=@"UPDATE sv.""languageGroup"" SET code=@code, name=@name, ""sortingOrder""=@sortingOrder
                WHERE id=@existingId;",
                addComment=@"
                    INSERT INTO sv.comment(""userId"", ""snippetId"", content, ""dateComment"")
                    VALUES (@userId, @snId, @content, @ts);",
                deleteComment=@"DELETE FROM sv.comment WHERE id=@comment;",
                vote=@"
                    BEGIN;
                    WITH existingVote AS (
                        SELECT uv.""snippetId"" FROM sv.""userVote"" uv 
                        WHERE uv.""userId""=@user AND uv.""taskLanguageId""=1 AND uv.""snippetId""<>@snId LIMIT 1
                    )
                    UPDATE sv.snippet SET score=score-1 WHERE id IN (SELECT ""snippetId"" FROM existingVote);
                    
                    INSERT INTO sv.""userVote""(""userId"", ""taskLanguageId"", ""snippetId"")
                    VALUES (@user, @tlId, @snId) 
                    ON CONFLICT(""userId"", ""taskLanguageId"") 
                    DO UPDATE SET ""snippetId""=EXCLUDED.""snippetId"";

                    UPDATE sv.snippet 
                    SET score=score + 1 WHERE id=@snId;
                    
                    COMMIT;
                ",
                userRegister=@"
                    INSERT INTO sv.""user""(name, ""dateJoined"", expiration, ""accessToken"", hash, salt)
                    	VALUES (@name, @tsJoin, @dtExpiration, @accessToken, 
                                decode(@hash, 'base64'), decode(@salt, 'base64')) 
                    ON CONFLICT DO NOTHING RETURNING id;
                ",
                userUpdateExpiration=@"
                    UPDATE sv.""user"" SET expiration=@newDate, accessToken=@newToken WHERE id=@id;
                ",
                userSignIn=@"
                    INSERT INTO sv.""user""(name, ""dateJoined"", expiration, ""accessToken"", hash, salt)
                    	VALUES (@name, @tsJoin, @dtExpiration, @accessToken, 
                                decode(@hash, 'base64'), decode(@salt, 'base64')) 
                    ON CONFLICT DO NOTHING RETURNING id;
                ",
                cleanSpamProposals=@"
                ",
            };
    }
}

}
