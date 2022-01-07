namespace SnippetVault {
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;


public class DataService : IDataService {
    private readonly IStore st;
    private readonly IStaticFiles staticFiles;
    public DataService(IStore _st, IStaticFiles _statics) {
        this.st = _st;
        this.staticFiles = _statics;
    }

    public async Task<ReqResult<SnippetDTO>> snippetsGet(int taskGroup, int lang1, int lang2) {
        return await st.snippetsGet(taskGroup, lang1, lang2);
    }

    public async Task<ReqResult<SnippetDTO>> snippetsGetByCode(string taskGroup, string lang1, string lang2) {
        return await st.snippetsGetByCode(taskGroup, lang1, lang2);
    }

    #region Snippets

    public async Task<int> proposalCreate(CreateProposalDTO dto, int authorId) {
        return await st.proposalCreate(dto, authorId);
    }

    public async Task<int> snippetApprove(int sn) {        
        return await st.snippetApprove(sn);        
    }

    public async Task<int> snippetDecline(int sn) {
        return await st.snippetDecline(sn);
    }

    public async Task<int> snippetMarkPrimary(int tlId, int snId) {
        var snippet = await st.snippetGet(snId);
        if (snippet is Success<BareSnippetDTO> succ) {
            if (succ.vals != null && succ.vals.Count == 1) {
                var existingSnip = succ.vals[0];
                if (existingSnip.status == SnippetStatus.Approved && existingSnip.taskLanguageId == tlId) {
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

    public async Task<ReqResult<AlternativesDTO>> alternativesForTLGet(int taskLanguageId, int? userId){
        var allAlternatives = userId == null ? await st.alternativesForTLGet(taskLanguageId) : await st.alternativesForUserGet(taskLanguageId, (int)userId);
        var mbTask = await st.taskForTLGet(taskLanguageId);
        
        if (allAlternatives is Success<AlternativeDTO> succ && mbTask is Success<TaskDTO> task) {
            var uniques = new HashSet<int>();
            AlternativeDTO primary = null;
            int primaryId = -1;
            foreach (var alt in succ.vals) {
                if (uniques.Contains(alt.id)) {
                    primary = alt;
                    primaryId = alt.id;
                    break;
                }
                uniques.Add(alt.id);
            }
            if (primary != null) {
                return new Success<AlternativesDTO>(
                    new List<AlternativesDTO>() {
                        new AlternativesDTO() {
                            primary = primary,
                            task = task.vals[0],
                            rows = succ.vals.Where(x => x.id != primaryId).ToArray(),
                        }
                    }
                );
            } else {
                return new Err<AlternativesDTO>("Error: no primary alternative was found");
            }
        } else {
            return new Err<AlternativesDTO>("Error: no alternatives found");
        }        
    }

    #endregion

    #region User

    public async Task<ReqResult<CommentDTO>> commentsGet(int snippetId) {
        return await st.commentsGet(snippetId);
    }

    public async Task<int> userVote(VoteDTO dto, int userId) {
        return await st.userVote(userId, dto.tlId, dto.snId);
    }

    public async Task<ReqResult<ProfileDTO>> userProfile(int userId) {
        var profileIncomplete = await st.userProfile(userId);
        var userData = await st.userData(userId);
        if (profileIncomplete is Success<ProfileDTO> prof && userData is Success<UserDTO> usr) {
            prof.vals[0].tsJoined = usr.vals[0].tsJoined;
        }
        return profileIncomplete;
    }

    public async Task<int> commentCreate(CommentCUDTO dto, int userId) {
        return await st.commentCreate(userId, dto.snId, dto.content, System.DateTime.Now);
    }

    #endregion

    #region Admin   

    public async Task<ReqResult<LanguageGroupedDTO>> languagesGetGrouped() {
        return await st.languagesGetGrouped();
    }

    public async Task<ReqResult<LanguageDTO>> languagesGet() {
        return await st.languagesGet();
    }

    public async Task<int> languageGroupCU(LanguageGroupCUDTO dto) {
        if (string.IsNullOrEmpty(dto.name) || string.IsNullOrEmpty(dto.code)) return -1;
        return await st.languageGroupCU(dto);            
    }

    public async Task<ReqResult<LanguageGroupDTO>> languageGroupsGet() {
        return await st.languageGroupsGet();
    }

    public async Task<int> languageCU(LanguageCUDTO dto) {
        if (string.IsNullOrEmpty(dto.name) || string.IsNullOrEmpty(dto.code)) return -1;
        return await st.languageCU(dto);
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

    public async Task<int> taskGroupCU(TaskGroupCUDTO dto) {
        if (string.IsNullOrEmpty(dto.name) || string.IsNullOrEmpty(dto.code)) return -1;
        return await st.taskGroupCU(dto);
    }

    public async Task<int> taskCU(TaskCUDTO dto) {
        if (string.IsNullOrEmpty(dto.name) || string.IsNullOrEmpty(dto.description)) return -1;
        return await st.taskCU(dto);
    }

    public async Task<ReqResult<StatsDTO>> statsForAdmin() {        
        var result = await st.statsForAdmin();
        var userCount = await st.userCount();
        if (result is Success<StatsDTO> stats) {
            stats.vals[0].userCount = userCount;
        }
        return result;
    }

    #endregion


    public string homePageGet() {
        return staticFiles.indexHtmlGet();
    }
}

public interface IDataService {
    Task<ReqResult<SnippetDTO>> snippetsGet(int taskGroup, int lang1, int lang2);
    Task<ReqResult<SnippetDTO>> snippetsGetByCode(string taskGroup, string lang1, string lang2);
    Task<int> proposalCreate(CreateProposalDTO dto, int authorId);
    Task<int> snippetApprove(int sn);
    Task<int> snippetDecline(int sn);
    Task<int> snippetMarkPrimary(int tlId, int snId);
    Task<ReqResult<ProposalDTO>> proposalsGet();
    Task<ReqResult<AlternativesDTO>> alternativesForTLGet(int taskLanguageId, int? userId);

    Task<ReqResult<LanguageDTO>> languagesGet();
    Task<ReqResult<LanguageGroupedDTO>> languagesGetGrouped();
    Task<int> languageGroupCU(LanguageGroupCUDTO dto);
    Task<ReqResult<LanguageGroupDTO>> languageGroupsGet();
    Task<int> languageCU(LanguageCUDTO dto);
    Task<ReqResult<StatsDTO>> statsForAdmin();

    Task<ReqResult<TaskGroupDTO>> taskGroupsGet();
    Task<int> taskGroupCU(TaskGroupCUDTO dto);
    Task<int> taskCU(TaskCUDTO dto);
    Task<ReqResult<TaskDTO>> tasksFromGroupGet(int taskGroup);
    Task<ReqResult<TaskGroupDTO>> taskGroupsForLangGet(int langId);
    Task<ReqResult<TaskGroupDTO>> taskGroupsForLangsGet(int lang1, int lang2);
    Task<ReqResult<CommentDTO>> commentsGet(int snippetId);
    Task<int> userVote(VoteDTO dto, int userId);
    Task<ReqResult<ProfileDTO>> userProfile(int userId);
    Task<int> commentCreate(CommentCUDTO dto, int userId);

    string homePageGet();
}

}