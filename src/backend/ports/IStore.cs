namespace SnippetVault {
using System.Threading.Tasks;

public interface IStore {
    Task<ReqResult<SnippetDTO>> snippetsGet(int taskGroupId, int lang1Id, int lang2Id);
    Task<ReqResult<LanguageDTO>> languagesGet();
    Task<ReqResult<TaskGroupDTO>> taskGroupsGet();
    Task<ReqResult<ProposalDTO>> proposalsGet();
    Task<ReqResult<TaskDTO>> tasksFromGroupGet(int taskGroup);
    Task<ReqResult<TaskGroupDTO>> taskGroupsForLangGet(int langId);
    Task<ReqResult<TaskGroupDTO>> taskGroupsForLangsGet(int lang1, int lang2);
    Task<ReqResult<AlternativeDTO>> alternativesForTLGet(int taskLanguageId);
    Task<ReqResult<CommentDTO>> commentsGet(int snippetId);
}

}