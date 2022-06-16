package tech.sozonov.SnippetVault.cmn.internal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Builder;

public class InternalTypes {


public static class AuthenticateIntern {
    public int userId;
    public byte[] salt;
    public byte[] verifier;
    public byte[] b;
    public LocalDate expiration;
    public String accessToken;
}

public static class HandshakeIntern {
    public int userId;
    public byte[] salt;
    public byte[] verifier;
}

public static class AuthorizeIntern {
    public String accessToken;
    public LocalDateTime expiration;
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
    public LocalDate dtExpiration;
}

@Builder
public static class UserSignInIntern {
    public int userId;
    public byte[] b;
    public String accessToken;
    public LocalDate dtExpiration;
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
