namespace SnippetVault {

public class SignInDTO {
    public int sessionId;
    public string accessToken;
}

public class UserCredsDTO {
    public int userId;
    public string salt;
    public byte[] hash;
}
}