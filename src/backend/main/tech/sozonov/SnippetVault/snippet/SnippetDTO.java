package tech.sozonov.SnippetVault.snippet;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;

public class SnippetDTO {


/** !!!
 *  All LocalDateTime members in all DTOs must have names starting with "ts" for correct deserialization on the client.
 *  !!!
 */

public static final class Task {
    public int id;
    public String name;
    public String taskGroupName;
    public String description;
}

public static final class Language {
    public int id;
    public String name;
    public String code;
    public int sortingOrder;
}

public static final class Proposal {
    public int proposalId;
    public String content;
    public int authorId;
    public String author;
    public String taskName;
    public String languageName;
    public LocalDateTime tsUpload;
    public String libraries;
}

@AllArgsConstructor
public static final class BareSnippet {
    public String content;
    public String libraries;
}

public static final class ProposalCreate {
    public int langId;
    public int taskId;
    public String content;
    public String libraries;
}

public static final class Snippet {
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

@AllArgsConstructor
public static final class Alternatives {
    public Alternative primary;
    public List<Alternative> rows;
    public Task task;
}

public static final class Alternative {
    public int id;
    public String content;
    public int score;
    public LocalDateTime tsUpload;
    public int commentCount;
    public boolean voteFlag;
    public String libraries;
}


}
