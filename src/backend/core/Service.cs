namespace SnippetVault {
    using System.Collections.Generic;
    using System.Threading.Tasks;


public class Service : IService {
    private readonly IStore st;
    private readonly IStaticFiles staticFiles;
    public Service(IStore _st, IStaticFiles _statics) {
        this.st = _st;
        this.staticFiles = _statics;
    }

    public async Task<ReqResult<SnippetDTO>> snippetsGet(int lang1, int lang2, int taskGroup) {
        return await st.snippetsGet(lang1, lang2, taskGroup);
    }

    public async Task<int> proposalCreate(CreateProposalDTO dto) {
        return await st.proposalCreate(dto);
    }

    public async Task<int> snippetApprove(int sn) {
        return await st.snippetApprove(sn);
    }

    public async Task<int> snippetDelete(int sn) {
        return await st.snippetDelete(sn);
    }

    public async Task<int> snippetMarkPrimary(int tlId, int snId) {
        var snippet = await st.snippetGet(snId);
        if (snippet is Success<BareSnippetDTO> succ) {
            if (succ.vals != null && succ.vals.Count == 1) {
                var existingSnip = succ.vals[0];
                if (existingSnip.isApproved && existingSnip.taskLanguageId == tlId) {
                    return await st.snippetMarkPrimary(tlId, snId);
                } else {
                    return -1;
                }
            } else {
                return -1;
            }
        } else {
            return -1;
        }        
    }    

    public async Task<ReqResult<ProposalDTO>> proposalsGet() {
        return await st.proposalsGet();
    }

    public async Task<ReqResult<LanguageGroupedDTO>> languagesGetGrouped() {
        return await st.languagesGetGrouped();
    }

    public async Task<ReqResult<LanguageDTO>> languagesGet() {
        return await st.languagesGet();
    }

    public async Task<int> languageGroupInsert(LanguageGroupDTO dto) {
        if (dto.name != null && dto.name.Length > 0) {
            return await st.languageGroupInsert(dto);
        } else {
            return -1;
        }
    }

    public async Task<int> languageInsert(LanguageDTO dto) {
        if (dto.name != null && dto.name.Length > 0 && dto.lgId > 0) {
            return await st.languageInsert(dto);
        } else {
            return -1;
        }
    }

    public async Task<ReqResult<AlternativeDTO>> alternativesForTLGet(int taskLanguageId){
        return await st.alternativesForTLGet(taskLanguageId);
    }

    public async Task<ReqResult<TaskGroupDTO>> taskGroupsForLangGet(int langId) {
        return await st.taskGroupsForLangGet(langId);
    }

    public async Task<ReqResult<TaskGroupDTO>> taskGroupsForLangsGet(int lang1, int lang2) {
        return await st.taskGroupsForLangsGet(lang1, lang2);
    }

    public async Task<ReqResult<TaskGroupDTO>> taskGroupsGet() {
        return await st.taskGroupsGet();
    }

    public async Task<ReqResult<TaskDTO>> tasksFromGroupGet(int taskGroup) {
        return await st.tasksFromGroupGet(taskGroup);
    }

    public async Task<int> taskGroupInsert(TaskGroupDTO dto) {
        if (dto.name != null && dto.name.Length > 0) {
            return await st.taskGroupInsert(dto);
        } else {
            return -1;
        }
    }

    public async Task<int> taskInsert(TaskDTO dto) {
        if (dto.name != null && dto.name.Length > 0 && dto.tgId > 0) {
            return await st.taskInsert(dto);
        } else {
            return -1;
        }
    }

    public async Task<ReqResult<CommentDTO>> commentsGet(int snippetId) {
        return await st.commentsGet(snippetId);
    }

    public async Task<ReqResult<SignInDTO>> signIn(string userName, string password) {
        var mbUserCreds = await st.userCredsGet(userName);
        if (mbUserCreds is Success<UserCredsDTO> userCreds && userCreds.vals.Count > 0) {
            bool authenticated = PasswordChecker.checkPassword(userCreds.vals[0], password);
            if (!authenticated) return new Err<SignInDTO>("Authentication error");
            
        } else {
            return new Err<SignInDTO>("Authentication error");
        }        
    }

    public async Task<ReqResult<SignInDTO>> register(string userName, string password) {
        // check if user exists and if the password is long enough
        if (password == null || password.Length < 8) {
            return new Err<SignInDTO>("Error! Password length must be at least 8 symbols");
        }

        // if everything's OK, insert a row with token and expiration
        var newHash = PasswordChecker.makeHash(password, out string newSalt);
        var newAccessToken = "";
        var newUserId = await st.userRegister(userName, newHash, newSalt, newAccessToken, System.DateTime.Today);
        return newUserId > 0 ? new Success<SignInDTO>(new List<SignInDTO>() {new SignInDTO() {accessToken = newAccessToken, userId = newUserId}}) 
                             : new Err<SignInDTO>("Error registering user");
    }

    public string homePageGet() {
        return staticFiles.indexHtmlGet();
    }
}

public interface IService {
    Task<ReqResult<SnippetDTO>> snippetsGet(int taskGroup, int lang1, int lang2);
    Task<int> proposalCreate(CreateProposalDTO dto);
    Task<int> snippetApprove(int sn);
    Task<int> snippetDelete(int sn);
    Task<int> snippetMarkPrimary(int tlId, int snId);
    Task<ReqResult<ProposalDTO>> proposalsGet();
    Task<ReqResult<AlternativeDTO>> alternativesForTLGet(int taskLanguageId);    

    Task<ReqResult<LanguageDTO>> languagesGet();
    Task<ReqResult<LanguageGroupedDTO>> languagesGetGrouped();
    Task<int> languageGroupInsert(LanguageGroupDTO dto);
    Task<int> languageInsert(LanguageDTO dto);

    Task<ReqResult<TaskGroupDTO>> taskGroupsGet();
    Task<int> taskGroupInsert(TaskGroupDTO dto);
    Task<int> taskInsert(TaskDTO dto);
    Task<ReqResult<TaskDTO>> tasksFromGroupGet(int taskGroup);
    Task<ReqResult<TaskGroupDTO>> taskGroupsForLangGet(int langId);
    Task<ReqResult<TaskGroupDTO>> taskGroupsForLangsGet(int lang1, int lang2);

    Task<ReqResult<CommentDTO>> commentsGet(int snippetId);

    Task<ReqResult<SignInDTO>> signIn(string userName, string password);
    Task<ReqResult<SignInDTO>> register(string userName, string password);
    string homePageGet();
}

}