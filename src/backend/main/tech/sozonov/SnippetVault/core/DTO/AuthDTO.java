package tech.sozonov.SnippetVault.core.DTO;


public class AuthDTO {

public static class SignInSuccess {
    public int userId;
}

public static class SignIn {
    public String userName;
    public String password;
}

public static class ChangePw {
    public SignIn signIn;
    public String newPw;
}

public static class SignInAdmin {
    public String userName;
    public String password1;
    public String password2;
}

public static class ChangePwAdmin {
    public SignInAdmin signIn;
    public String newPw;
}

}
