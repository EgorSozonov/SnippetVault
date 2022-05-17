package tech.sozonov.SnippetVault.snippet;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;

public class SnippetDTO {


/** !!!
 *  All LocalDateTime members in all DTOs must have names starting with "ts" for correct deserialization on the client.
 *  !!!
 */

public static class TaskGroup {
    public int id;
    public String name;
    public String code;
}

public static class Task {
    public int id;
    public String name;
    public String taskGroupName;
    public String description;
}

public static class Language {
    public int id;
    public String name;
    public String code;
    public int sortingOrder;
}

public static class Proposal {
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
public static class BareSnippet {
    public String content;
    public String libraries;
}

public static class ProposalCreate {
    public int langId;
    public int taskId;
    public String content;
    public String libraries;
}

public static class Snippet {
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

public static class Alternatives {
    public Alternative primary;
    public Task task;
    public Alternative[] rows;
}

public static class Alternative {
    public int id;
    public String content;
    public int score;
    public LocalDateTime tsUpload;
    public int commentCount;
    public boolean voteFlag;
    public String libraries;
}


}
