namespace SnippetVault {
using System;
    

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
    public int lgId {get;set;}
    public string lgName {get;set;}
}

public class LanguageGroupedDTO {
    public int id{get; set;}
    public string name{get; set;}
    public string languageGroup{get; set;}
    public int languageGroupOrder {get;set;}
}

public class LanguageGroupDTO {
    public int id{get; set;}
    public string name{get; set;}
}

public class ProposalDTO {
    public int proposalId {get; set;}
    public string proposalCode {get; set;}
    public string taskName {get; set;}
    public string languageName {get; set;}
    public DateTime tsUpload {get; set;}
}

public class SnippetDTO {
    public int leftId {get; set;}
    public string leftCode {get; set;}
    public int taskId {get; set;}
    public string taskName {get; set;} 
    public int rightId {get; set;}
    public string rightCode {get; set;}
}

public class BareSnippetDTO {
    public int taskLanguageId {get; set;}
    public string content {get; set;}
    public bool isApproved {get; set;}
    public int score {get; set;} 
}

public class TaskDTO {
    public int id{get; set;}
    public string name{get; set;}
    public int tgId{get; set;}
    public string description{get; set;}
}

public class TaskGroupDTO {
    public int id{get; set;}
    public string name{get; set;}
}

}