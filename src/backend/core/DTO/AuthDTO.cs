using System;
namespace SnippetVault {

public class SignInDTO {
    public int userId;
    public string accessToken;
}

public class UserCredsDTO {
    public int userId;
    public string salt;
    public byte[] hash;
    public DateTime expiration;
    public string accessToken;
}

}