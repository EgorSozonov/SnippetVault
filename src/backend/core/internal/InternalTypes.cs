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
    public string libraries {get; set;}
}

public class UserNewIntern {
    public string userName;
    public string hash;
    public string salt;
    public string accessToken;
    public DateOnly dtExpiration;
}

public class TaskCUIntern {
    public int taskGroupId {get; set;}
    public string taskGroupName {get; set;}
    public string name {get; set;}
    public string description {get; set;}
    public int existingId {get; set;}
    public bool isDeleted {get; set;}
}

public enum SnippetStatus {
    Proposal = 1,
    Declined = 2,
    Approved = 3,
}

}
