using System.Threading.Tasks;

namespace SnippetVault {

public class API : IAPI{
    private readonly IStore st;
    private readonly IStaticFiles staticFiles;
    public API(IStore _st, IStaticFiles _statics) {
        this.st = _st;
        this.staticFiles = _statics;
    }

    public async Task<ReqResult<SnippetDTO>> snippetsGet(int lang1, int lang2, int taskGroup) {
        return await st.snippetsGet(lang1, lang2, taskGroup);
    }

    public async Task<int> snippetAdd(CreateSnippetDTO dto) {
        return await st.snippetAdd(dto);
    }

    public async Task<int> snippetApprove(int sn) {
        return await st.snippetApprove(sn);
    }

    public async Task<int> snippetDelete(int sn) {
        return await st.snippetDelete(sn);
    }

    public async Task<int> snippetMarkPrimary(int sn) {
        return await st.snippetMarkPrimary(sn);
    }    

    public async Task<ReqResult<ProposalDTO>> proposalsGet() {
        return await proposalsGet();
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

    public string homePageGet() {
        return staticFiles.indexHtmlGet();
    }
}

public interface IAPI {
    Task<ReqResult<SnippetDTO>> snippetsGet(int taskGroup, int lang1, int lang2);
    Task<int> snippetAdd(CreateSnippetDTO dto);
    Task<int> snippetApprove(int sn);
    Task<int> snippetDelete(int sn);
    Task<int> snippetMarkPrimary(int sn);
    Task<ReqResult<ProposalDTO>> proposalsGet();
    Task<ReqResult<AlternativeDTO>> alternativesForTLGet(int taskLanguageId);    

    Task<ReqResult<LanguageDTO>> languagesGet();
    Task<int> languageGroupInsert(LanguageGroupDTO dto);
    Task<int> languageInsert(LanguageDTO dto);

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