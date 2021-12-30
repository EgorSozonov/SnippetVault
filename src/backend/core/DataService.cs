namespace SnippetVault {
using System.Threading.Tasks;


public class DataService : IDataService {
    private readonly IStore st;
    private readonly IStaticFiles staticFiles;
    public DataService(IStore _st, IStaticFiles _statics) {
        this.st = _st;
        this.staticFiles = _statics;
    }

    public async Task<ReqResult<SnippetDTO>> snippetsGet(int lang1, int lang2, int taskGroup) {
        return await st.snippetsGet(lang1, lang2, taskGroup);
    }

    #region Snippets

    public async Task<int> proposalCreate(CreateProposalDTO dto, int authorId) {
        return await st.proposalCreate(dto, authorId);
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
            if (succ.vals != null && succ.vals.Count ==  1) {
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

    public async Task<ReqResult<AlternativeDTO>> alternativesForTLGet(int taskLanguageId){
        return await st.alternativesForTLGet(taskLanguageId);
    }

    public async Task<ReqResult<CommentDTO>> commentsGet(int snippetId) {
        return await st.commentsGet(snippetId);
    }

    public async Task<int> userVote(VoteDTO dto, int userId) {
        return await st.userVote(userId, dto.tlId, dto.snId);
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
        return result;
    }

    #endregion


    public string homePageGet() {
        return staticFiles.indexHtmlGet();
    }
}

public interface IDataService {
    Task<ReqResult<SnippetDTO>> snippetsGet(int taskGroup, int lang1, int lang2);
    Task<int> proposalCreate(CreateProposalDTO dto, int authorId);
    Task<int> snippetApprove(int sn);
    Task<int> snippetDelete(int sn);
    Task<int> snippetMarkPrimary(int tlId, int snId);
    Task<ReqResult<ProposalDTO>> proposalsGet();
    Task<ReqResult<AlternativeDTO>> alternativesForTLGet(int taskLanguageId);    

    Task<ReqResult<LanguageDTO>> languagesGet();
    Task<ReqResult<LanguageGroupedDTO>> languagesGetGrouped();
    Task<int> languageGroupCU(LanguageGroupCUDTO dto);
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
    Task<int> commentCreate(CommentCUDTO dto, int userId);

    string homePageGet();
}

}