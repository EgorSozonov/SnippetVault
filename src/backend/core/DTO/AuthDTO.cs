using System;
namespace SnippetVault {

public class SignInDTO {
    public int userId {get; set;}
    public string accessToken {get; set;}
}

public class UserCredsDTO {
    public int userId {get; set;}
    public string salt {get; set;}
    public string hash {get; set;}
    public DateTime expiration {get; set;}
    public string accessToken {get; set;}
}

}