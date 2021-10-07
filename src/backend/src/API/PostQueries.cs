namespace SnippetVault {


public class PostPGQueries  {
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
    }

    public static PostQueries mkPostQueries() {
        return new PostQueries() {
            addSnippet=@"
                INSERT INTO snippet.snippet(""taskLanguageId"", content, ""isApproved"", score)
                VALUES (?, ?, 0, 0);", 
            
            };
    }
}

}