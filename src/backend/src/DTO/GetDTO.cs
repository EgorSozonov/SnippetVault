using System;
namespace SnippetVault {
    

public class AlternativeDTO {
    public int primaryId;
    public string primaryCode;
    public int primaryScore;
    public int alternativeId;
    public string alternativeCode;
    public int alternativeScore;
    public DateTime tsUpload;
}

public class CommentDTO {
    public int id;
    public string author;
    public DateTime ts;
    public string content;
}

public class LanguageDTO {
    public int id;
    public string name;
    public string languageGroup;
}

public class ProposalDTO {
    public int proposalId;
    public string proposalCode;
    public string taskName;
    public string languageName;
    public DateTime tsUpload;
}

public class SnippetDTO {
    public int leftId;
    public string leftCode;
    public int taskId;
    public string taskName;
    public int rightId;
    public string rightCode;
}

public class TaskDTO {
    public int id;
    public string name;
    public string description;
}

public class TaskGroupDTO {
    public int id;
    public string name;
}

}