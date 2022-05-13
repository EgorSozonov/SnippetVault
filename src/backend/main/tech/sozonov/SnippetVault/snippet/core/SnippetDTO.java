package tech.sozonov.SnippetVault.snippet.core;

public class SnippetDTO {


/** !!!
 *  All LocalDateTime members in all DTOs must have names starting with "ts" for correct deserialization on the client.
 *  !!!
 */

public class Proposal {
    public int proposalId;
    public String content;
    public int authorId;
    public String author;
    public String taskName;
    public String languageName;
    public LocalDateTime tsUpload;
    public String libraries;
}

public class BareSnippet {
    public String content;
    public String libraries;
}

public class ProposalCreate {
    public int langId;
    public int taskId;
    public String content;
    public String libraries;
}

public class ProposalUpdate {
    public int existingId;
    public String content;
    public String libraries;
}

public class Snippet {
    public int leftId;
    public String leftCode;
    public int leftTlId;
    public String leftLibraries;
    public int taskId;
    public String taskName;
    public int rightId;
    public String rightCode;
    public int rightTlId;
    public String rightLibraries;
}

public class Alternatives {
    public Alternative primary;
    public Task task;
    public Alternative[] rows;
}

public class Alternative {
    public int id;
    public String content;
    public int score;
    public LocalDateTime tsUpload;
    public int commentCount;
    public boolean voteFlag;
    public String libraries;
}



}
