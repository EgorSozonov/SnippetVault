namespace SnippetVault {
using System.Threading.Tasks;

public interface IStore {
    Task<ReqResult<SnippetDTO>> getSnippets(int taskGroupId, int lang1Id, int lang2Id);
    Task<ReqResult<LanguageDTO>> getLanguages();
    Task<ReqResult<TaskGroupDTO>> getTaskGroups();
}

}