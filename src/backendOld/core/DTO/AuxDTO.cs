namespace SnippetVault {
using System;


public class TaskDTO {
    public int id {get; set;}
    public string name {get; set;}
    public string taskGroupName {get; set;}
    public string description {get; set;}
}

public class TaskGroupDTO {
    public int id {get; set;}
    public string name {get; set;}
    public string code {get; set;}
}

public class LanguageDTO {
    public int id {get; set;}
    public string name {get; set;}
    public string code {get; set;}
    public int sortingOrder { get; set; }
}

public class TaskCUDTO : CUDTO {
    public SelectChoice taskGroup {get; set;}
    public string name {get; set;}
    public string description {get; set;}
}

public class TaskGroupCUDTO : CUDTO {
    public string code {get; set;}
    public string name {get; set;}
}

public class LanguageCUDTO : CUDTO {
    public string name { get; set; }
    public string code { get; set; }
    public int sortingOrder { get; set; }
}

public class CUDTO {
    public int existingId {get; set;}
    public bool isDeleted {get; set;}
}

public class PostResponseDTO {
    public string status {get; set;}
}

}
