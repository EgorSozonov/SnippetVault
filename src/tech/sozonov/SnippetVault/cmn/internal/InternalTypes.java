package tech.sozonov.SnippetVault.cmn.internal;
import java.time.Instant;
import lombok.Builder;

public class InternalTypes {


public static class AuthenticateIntern {
    public int userId;
    public byte[] salt;
    public byte[] verifier;
    public byte[] b;
    public Instant expiration;
    public String accessToken;
}

public static class HandshakeIntern {
    public int userId;
    public byte[] salt;
    public byte[] verifier;
}

public static class AuthorizeIntern {
    public String accessToken;
    public Instant expiration;
}

public static class SnippetIntern {
    public int taskLanguageId;
    public String content;
    public int status;
    public int score;
    public String libraries;
}

@Builder
public static class UserNewIntern {
    public String userName;
    public byte[] verifier;
    public byte[] salt;
    public byte[] b;
    public String accessToken;
    public Instant dtExpiration;
}

@Builder
public static class UserSignInIntern {
    public int userId;
    public byte[] b;
    public String accessToken;
    public Instant dtExpiration;
}

@Builder
public static class UserUpdatePwIntern {
    public String userName;
    public String accessToken;
    public Instant dtExpiration;
    public byte[] verifier;
    public byte[] salt;
}

public static class TaskCUIntern {
    public int taskGroupId;
    public String taskGroupName;
    public String name;
    public String description;
    public int existingId;
    public boolean isDeleted;
}

public static class  SnippetStatus {
    public static final int Proposal = 1;
    public static final int Declined = 2;
    public static final int Approved = 3;
}


}
