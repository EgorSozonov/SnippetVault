namespace SnippetVault {

public class CreateProposalDTO {
    public int langId {get; set; }
    public int taskId {get; set; }
    public string content { get; set; }
}

public class UserSignInDTO {
    public string userName {get; set; }
    public string password {get; set; }
}

}