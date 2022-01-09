namespace SnippetVault {
using System;    

public class AuthenticateIntern {
    public int userId {get; set;}
    public string salt {get; set;}
    public string hash {get; set;}
    public DateTime expiration {get; set;}
    public string accessToken {get; set;}
}

public class AuthorizeIntern {
    public string accessToken {get; set;}
    public DateTime expiration {get; set;}
}

public class SnippetIntern {
    public int taskLanguageId {get; set;}
    public string content {get; set;}
    public int status {get; set;}
    public int score {get; set;} 
}

public enum SnippetStatus {
    Proposal = 1,
    Declined = 2,
    Approved = 3,
}

}