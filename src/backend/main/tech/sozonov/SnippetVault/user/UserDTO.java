package tech.sozonov.SnippetVault.user;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import tech.sozonov.SnippetVault.cmn.utils.Types.CreateUpdate;

public class UserDTO {


public static class User {
    public String name;
    public LocalDateTime tsJoined;
}

public static class Comment {
    public int id;
    public String author;
    public LocalDateTime tsUpload;
    public String content;
}

public static class CommentCU extends CreateUpdate {
    public int snId;
    public String content;
}

public static class Profile {
    public int proposalCount;
    public int approvedCount;
    public int primaryCount;
    public LocalDateTime tsJoined;
}

public static class Vote {
    public int snId;
    public int tlId;
}

@AllArgsConstructor
public static class SignInSuccess {
    public int userId;
}

@AllArgsConstructor
public static class Register {
    public String userName;
    public String saltB64;
    public String verifierB64;
}

@AllArgsConstructor
public static class Handshake {
    public String userName;
}

@AllArgsConstructor
public static class HandshakeResponse {
    public String saltB64;
    public String BB64;
}

@AllArgsConstructor
public static class SignIn {
    public String userName;
    public String AB64;
    public String M1B64;
}

@AllArgsConstructor
public static class SignInResponse {
    public String M2B64;
    public int userId;
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
