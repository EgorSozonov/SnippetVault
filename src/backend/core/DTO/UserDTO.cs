namespace SnippetVault {
using System;


public class UserDTO {
    public string name {get; set;}
    public DateTime tsJoined {get; set;}
}

public class CommentDTO {
    public int id {get; set;}
    public string author {get; set;}
    public DateTime ts {get; set;}
    public string content {get; set;}
}

public class CommentCUDTO : CUDTO {
    public int snId {get; set;}
    public string content {get; set;}
}

public class ProfileDTO {
    public int proposalCount {get; set;}
    public int approvedCount {get; set;}
    public int primaryCount {get; set;}
    public DateTime tsJoined {get; set;}
}

public class VoteDTO {
    public int snId {get; set;}
    public int tlId {get; set;}
}

public class StatsDTO {
    public int primaryCount {get; set;}
    public int alternativeCount {get; set;}
    public int proposalCount {get; set;}
    public int userCount {get; set;}
}

}