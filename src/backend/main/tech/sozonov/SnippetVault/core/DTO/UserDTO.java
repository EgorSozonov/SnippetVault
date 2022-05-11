package tech.sozonov.SnippetVault.core.DTO;
import java.time.LocalDateTime;
import tech.sozonov.SnippetVault.core.utils.Types.CreateUpdate;


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

public static class Stats {
    public int primaryCount;
    public int alternativeCount;
    public int proposalCount;
    public long userCount;
}

}
