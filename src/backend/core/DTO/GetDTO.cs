namespace SnippetVault {
using System;   


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
    public AlternativeDTO[] rows {get; set;}
}

public class AlternativeDTO {
    public int id {get; set;}
    public string code {get; set;}
    public int score {get; set;}
    public DateTime tsUpload {get; set;}
}

public class CommentDTO {
    public int id {get; set;}
    public string author {get; set;}
    public DateTime ts {get; set;}
    public string content {get; set;}
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
    public int taskLanguageId {get; set;}
    public string content {get; set;}
    public SnippetStatus status {get; set;}
    public int score {get; set;} 
}

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

public class StatsDTO {
    public int primaryCount {get; set;}
    public int alternativeCount {get; set;}
    public int proposalCount {get; set;}
}

public class ProfileDTO {
    public int proposalCount {get; set;}
    public int approvedCount {get; set;}
    public int primaryCount {get; set;}
    public DateTime tsJoined {get; set;}
}

}