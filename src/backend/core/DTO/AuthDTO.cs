namespace SnippetVault {
using System;
    

public class SignInDTO {
    public string userName {get; set;}
    public string password {get; set;}
}

public class UpdatePwDTO {
    public SignInDTO signIn {get; set;}
    public string newPw {get; set;}
}

public class SignInAdminDTO {
    public string userName {get; set; }
    public string password1 {get; set; }
    public string password2 {get; set; }
}

public class UpdatePwAdminDTO {
    public SignInAdminDTO signIn {get; set;}
    public string newPw {get; set;}
}

public class SignInSuccessDTO {
    public int userId {get; set; }
    public string accessToken {get; set; }
}

}