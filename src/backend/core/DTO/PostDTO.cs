namespace SnippetVault {

public class CreateProposalDTO {
    public int langId { get; set; }
    public int taskId { get; set; }
    public string content { get; set; }
}

public class VoteDTO {
    public int snId {get; set;}
    public int tlId {get; set;}
}

public class CUDTO {
    public int? existingId {get; set;}
}

public class TaskCUDTO : CUDTO {
    public int tgId {get; set;}
    public string name {get; set;}
    public string description {get; set;}
}

public class TaskGroupCUDTO : CUDTO {
    public bool isDeleted {get; set;}
    public string code {get; set;}
    public string name {get; set;}
}

public class LanguageCUDTO : CUDTO {
    public int lgId { get; set; }
    public string name { get; set; }
    public string code { get; set; }
    public bool isDeleted { get; set; }
}

public class LanguageGroupCUDTO : CUDTO {
    public int sortingOrder {get; set;}
    public string code {get; set;}
    public string name {get; set;}
    public bool isDeleted {get; set;}
}

public class CommentCUDTO : CUDTO {
    public int snId {get; set;}
    public string content {get; set;}
}

}