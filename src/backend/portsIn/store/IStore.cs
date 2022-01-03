namespace SnippetVault {
using System;
using System.Threading.Tasks;


public interface IStore {
    Task<ReqResult<SnippetDTO>> snippetsGet(int taskGroupId, int lang1Id, int lang2Id);
    Task<ReqResult<SnippetDTO>> snippetsGetByCode(string taskGroupCode, string lang1Code, string lang2Code);
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
    Task<int> snippetDecline(int sn);
    Task<int> snippetMarkPrimary(int tlId, int snId);
    Task<int> taskGroupCU(TaskGroupCUDTO dto);
    Task<int> taskCU(TaskCUDTO dto);
    Task<int> languageGroupCU(LanguageGroupCUDTO dto);
    Task<int> languageCU(LanguageCUDTO dto);
    Task<ReqResult<StatsDTO>> statsForAdmin();

    Task<ReqResult<AuthenticateIntern>> userAuthentGet(string userName);
    Task<ReqResult<AuthorizeIntern>> userAuthorGet(int userId);
    Task<ReqResult<AuthenticateIntern>> userAdminAuthent(string accessToken);
    Task<ReqResult<AuthorizeIntern>> userAdminAuthor();
    Task<int> userUpdateExpiration(int userId, string newToken, DateTime newDate);
    Task<int> userRegister(string userName, string hash, string salt, string accessToken, DateTime tsExpiration);
    Task<int> userVote(int userId, int tlId, int snId);
    Task<int> commentCreate(int userId, int snId, string content, DateTime ts);
}

}