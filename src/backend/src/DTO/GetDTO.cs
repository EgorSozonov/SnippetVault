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
    public int id{get; set;}
    public string name{get; set;}
    public string languageGroup{get; set;}
}

public class ProposalDTO {
    public int proposalId;
    public string proposalCode;
    public string taskName;
    public string languageName;
    public DateTime tsUpload;
}

public class SnippetDTO {
    public int leftId {get; set;}
    public string leftCode {get; set;}
    public int taskId {get; set;}
    public string taskName {get; set;} 
    public int rightId {get; set;}
    public string rightCode {get; set;}
}

public class TaskDTO {
    public int id{get; set;}
    public string name{get; set;}
    public string description{get; set;}
}

public class TaskGroupDTO {
    public int id{get; set;}
    public string name{get; set;}
}

}