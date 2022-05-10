namespace SnippetVault {
using System;
using System.Threading.Tasks;


public interface IStore {
    Task<ReqResult<SnippetDTO>> snippetsGet(int taskGroupId, int lang1Id, int lang2Id);
    Task<ReqResult<SnippetDTO>> snippetsGetByCode(string taskGroupCode, string lang1Code, string lang2Code);
    Task<ReqResult<SnippetIntern>> snippetGet(int snId);
    Task<ReqResult<LanguageDTO>> languagesGet();
    Task<ReqResult<TaskGroupDTO>> taskGroupsGet();
    Task<ReqResult<ProposalDTO>> proposalsGet();
    Task<ReqResult<TaskDTO>> tasksFromGroupGet(int taskGroup);
    Task<ReqResult<TaskGroupDTO>> taskGroupsForLangGet(int langId);
    Task<ReqResult<TaskGroupDTO>> taskGroupsForLangsGet(int lang1, int lang2);
    Task<ReqResult<AlternativeDTO>> alternativesForTLGet(int taskLanguageId);
    Task<ReqResult<AlternativeDTO>> alternativesForUserGet(int taskLanguageId, int userId);
    Task<ReqResult<CommentDTO>> commentsGet(int snippetId);
    Task<int> proposalCreate(ProposalCreateDTO dTO, int authorId);
    Task<int> proposalUpdate(ProposalUpdateDTO dto);

    Task<int> snippetApprove(int sn);
    Task<int> snippetDecline(int sn);
    Task<int> snippetMarkPrimary(int tlId, int snId);
    Task<ReqResult<TaskDTO>> taskGet(int taskId);
    Task<ReqResult<TaskDTO>> taskForTLGet(int taskLanguageId);

    Task<ReqResult<TaskCUIntern>> tasksAll();
    Task<int> taskGroupCU(TaskGroupCUDTO dto);
    Task<ReqResult<TaskGroupCUDTO>> taskGroupsAll();
    Task<ReqResult<LanguageCUDTO>> languagesAll();
    Task<int> taskCU(TaskCUDTO dto);
    Task<int> languageCU(LanguageCUDTO dto);
    Task<ReqResult<StatsDTO>> statsForAdmin();
    Task<long> userCount();

    Task<ReqResult<AuthenticateIntern>> userAuthentGet(string userName);
    Task<ReqResult<AuthorizeIntern>> userAuthorizGet(int userId);
    Task<ReqResult<AuthorizeIntern>> userAdminAuthoriz();
    Task<int> userUpdateExpiration(int userId, string newToken, DateTime newDate);
    Task<int> userRegister(UserNewIntern user);
    Task<int> userUpdate(UserNewIntern user);
    Task<int> userVote(int userId, int tlId, int snId);
    Task<ReqResult<ProfileDTO>> userProfile(int userId);
    Task<ReqResult<UserDTO>> userData(int userId);
    Task<int> commentCreate(int userId, int snId, string content, DateTime ts);

    Task<int> logMessage(DateTime ts, int msgType, string code, string message);
}

}
