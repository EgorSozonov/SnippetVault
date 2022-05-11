package tech.sozonov.SnippetVault.core.DTO;

public class AuthDTO {
    public static class SignInSuccessDTO {
        public int userId;
    }
    
    public static  class SignInDTO {
        public String userName;
        public String password;
    }
    
    public static class ChangePwDTO {
        public SignInDTO signIn;
        public String newPw;
    }
    
    public static class SignInAdminDTO {
        public String userName;
        public String password1;
        public String password2;
    }
    
    public static class ChangePwAdminDTO {
        public SignInAdminDTO signIn;
        public String newPw;
    }
}
