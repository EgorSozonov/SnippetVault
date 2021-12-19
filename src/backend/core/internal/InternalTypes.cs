namespace SnippetVault {
using System;    

public class AuthenticateIntern {
    public int userId {get; set;}
    public string salt {get; set;}
    public string hash {get; set;}
    public DateTime expiration {get; set;}
}

public class AuthorizeIntern {
    public string accessToken {get; set;}
    public DateTime expiration {get; set;}
}

}