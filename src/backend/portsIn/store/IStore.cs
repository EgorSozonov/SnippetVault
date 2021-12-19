namespace SnippetVault {
using System;
using System.Threading.Tasks;


public interface IStore {
    Task<ReqResult<SnippetDTO>> snippetsGet(int lang1Id, int lang2Id, int taskGroupId);
    Task<ReqResult<BareSnippetDTO>> snippetGet(int snId);
    Task<ReqResult<LanguageGroupedDTO>> languagesGetGrouped();
    Task<ReqResult<LanguageDTO>> languagesGet();
    Task<ReqResult<TaskGroupDTO>> taskGroupsGet();
    Task<ReqResult<ProposalDTO>> proposalsGet();
    Task<ReqResult<TaskDTO>> tasksFromGroupGet(int taskGroup);
    Task<ReqResult<TaskGroupDTO>> taskGroupsForLangGet(int langId);
    Task<ReqResult<TaskGroupDTO>> taskGroupsForLangsGet(int lang1, int lang2);
    Task<ReqResult<AlternativeDTO>> alternativesForTLGet(int taskLanguageId);
    Task<ReqResult<CommentDTO>> commentsGet(int snippetId);
    Task<int> proposalCreate(CreateProposalDTO dTO, int authorId);
    Task<int> snippetApprove(int sn);
    Task<int> snippetDelete(int sn);
    Task<int> snippetMarkPrimary(int tlId, int snId);
    Task<int> taskGroupInsert(TaskGroupDTO dto);
    Task<int> taskInsert(TaskDTO dto);
    Task<int> languageGroupInsert(LanguageGroupDTO dto);
    Task<int> languageInsert(LanguageDTO dto);

    Task<ReqResult<AuthenticateDTO>> userAuthentGet(string userName);
    Task<ReqResult<AuthorizeDTO>> userAuthorGet(int userId);
    Task<ReqResult<AuthorizeDTO>> userAdminData(string accessToken);
    Task<int> userUpdateExpiration(int userId, string newToken, DateTime newDate);
    Task<int> userRegister(string userName, string hash, string salt, string accessToken, DateTime tsExpiration);
}

}