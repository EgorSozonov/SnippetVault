using System;
namespace SnippetVault {

public class SignInDTO {
    public string userName {get; set;}
    public string password {get; set;}
}

public class SignInAdminDTO {
    public string userName {get; set; }
    public string password1 {get; set; }
    public string password2 {get; set; }
}

public class SignInSuccessDTO {
    public int userId;
    public string accessToken;
}

}