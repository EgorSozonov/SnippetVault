using System.Threading.Tasks;

namespace SnippetVault {

public class API : IAPI{
    private readonly IStore st;
    private readonly IStaticFiles staticFiles;
    public API(IStore _st, IStaticFiles _statics) {
        this.st = _st;
        this.staticFiles = _statics;
    }

    public async Task<ReqResult<AlternativeDTO>> alternativesForTLGet(int taskLanguageId){
        return await st.alternativesForTLGet(taskLanguageId);
    }

    public async Task<ReqResult<CommentDTO>> commentsGet(int snippetId) {
        return await st.commentsGet(snippetId);
    }

    public async Task<ReqResult<LanguageDTO>> languagesGet() {
        return await st.languagesGet();
    }

    public async Task<ReqResult<ProposalDTO>> proposalsGet() {
        return await proposalsGet();
    }

    public async Task<ReqResult<SnippetDTO>> snippetsGet(int lang1, int lang2, int taskGroup) {
        return await st.snippetsGet(lang1, lang2, taskGroup);
    }

    public async Task<string> snippetAdd(CreateSnippetDTO dto) {
        var res = await st.snippetAdd(dto);
        if (res > 0) {
            return "OK";
        } else {
            return "err";
        }
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

    public string homePageGet() {
        return staticFiles.indexHtmlGet();
    }
}

public interface IAPI {
    Task<ReqResult<SnippetDTO>> snippetsGet(int taskGroup, int lang1, int lang2);
    Task<string> snippetAdd(CreateSnippetDTO dto);
    Task<ReqResult<LanguageDTO>> languagesGet();
    Task<ReqResult<TaskGroupDTO>> taskGroupsGet();
    Task<ReqResult<ProposalDTO>> proposalsGet();
    Task<ReqResult<TaskDTO>> tasksFromGroupGet(int taskGroup);
    Task<ReqResult<TaskGroupDTO>> taskGroupsForLangGet(int langId);
    Task<ReqResult<TaskGroupDTO>> taskGroupsForLangsGet(int lang1, int lang2);
    Task<ReqResult<AlternativeDTO>> alternativesForTLGet(int taskLanguageId);
    Task<ReqResult<CommentDTO>> commentsGet(int snippetId);
    string homePageGet();
}

}