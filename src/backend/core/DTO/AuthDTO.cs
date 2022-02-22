namespace SnippetVault {


public class SignInSuccessDTO {
    public int userId {get; set; }
}

public class SignInDTO {
    public string userName {get; set;}
    public string password {get; set;}
}

public class ChangePwDTO {
    public SignInDTO signIn {get; set;}
    public string newPw {get; set;}
}

public class SignInAdminDTO {
    public string userName {get; set; }
    public string password1 {get; set; }
    public string password2 {get; set; }
}

public class ChangePwAdminDTO {
    public SignInAdminDTO signIn {get; set;}
    public string newPw {get; set;}
}

}
