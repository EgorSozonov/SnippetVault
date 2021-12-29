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

    public async Task<ReqResult<StatsDTO>> statsForAdmin() {        
        var result = await st.statsForAdmin();
        return result;
    }

    public async Task<ReqResult<CommentDTO>> commentsGet(int snippetId) {
        return await st.commentsGet(snippetId);
    }

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
    Task<int> languageGroupInsert(LanguageGroupDTO dto);
    Task<int> languageInsert(LanguageDTO dto);
    Task<ReqResult<StatsDTO>> statsForAdmin();

    Task<ReqResult<TaskGroupDTO>> taskGroupsGet();
    Task<int> taskGroupInsert(TaskGroupDTO dto);
    Task<int> taskInsert(TaskDTO dto);
    Task<ReqResult<TaskDTO>> tasksFromGroupGet(int taskGroup);
    Task<ReqResult<TaskGroupDTO>> taskGroupsForLangGet(int langId);
    Task<ReqResult<TaskGroupDTO>> taskGroupsForLangsGet(int lang1, int lang2);
    Task<ReqResult<CommentDTO>> commentsGet(int snippetId);

    string homePageGet();
}

}