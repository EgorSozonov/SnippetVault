namespace SnippetVault {
using System;


public class TaskDTO {
    public int id {get; set;}
    public string name {get; set;}
    public int tgId {get; set;}
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
    public int lgId {get;set;}
    public string lgName {get;set;}
}

public class LanguageGroupedDTO {
    public int id {get; set;}
    public string code {get; set;}
    public string name {get; set;}
    public string languageGroup {get; set;}
    public int languageGroupOrder {get; set;}
}

public class LanguageGroupDTO {
    public int id {get; set;}
    public string name {get; set;}
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
}

public class CUDTO {
    public int? existingId {get; set;}
}

}