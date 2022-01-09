namespace SnippetVault {
using System;

/// !!!
/// All Datetime members in all DTOs must have names starting with "ts" for correct deserialization on the client.
/// !!!

public class ProposalDTO {
    public int proposalId {get; set;}
    public string proposalCode {get; set;}
    public int authorId {get; set;}
    public string author {get; set;}
    public string taskName {get; set;}
    public string languageName {get; set;}
    public DateTime tsUpload {get; set;}
}

public class BareSnippetDTO {
    public string content {get; set;}
}

public class ProposalCreateDTO {
    public int langId { get; set; }
    public int taskId { get; set; }
    public string content { get; set; }
}

public class ProposalUpdateDTO {
    public int existingId { get; set; }
    public string content { get; set; }
}

public class SnippetDTO {
    public int leftId {get; set;}
    public string leftCode {get; set;}
    public int leftTlId {get; set;}
    public int taskId {get; set;}
    public string taskName {get; set;} 
    public int rightId {get; set;}
    public string rightCode {get; set;}
    public int rightTlId {get; set;}
}

public class AlternativesDTO {
    public AlternativeDTO primary {get; set;}
    public TaskDTO task {get; set;}
    public AlternativeDTO[] rows {get; set;}
}

public class AlternativeDTO {
    public int id {get; set;}
    public string code {get; set;}
    public int score {get; set;}
    public DateTime tsUpload {get; set;}
    public int commentCount {get; set;}
    public bool voteFlag {get; set;}
}

}