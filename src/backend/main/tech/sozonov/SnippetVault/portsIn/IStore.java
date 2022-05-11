package tech.sozonov.SnippetVault.portsIn;
import java.time.LocalDateTime;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.core.DTO.AuxDTO.*;
import tech.sozonov.SnippetVault.core.DTO.SnippetDTO.*;
import tech.sozonov.SnippetVault.core.DTO.UserDTO.*;
import tech.sozonov.SnippetVault.core.internal.InternalTypes.*;
import tech.sozonov.SnippetVault.core.utils.Types.ReqResult;


public interface IStore {

Mono<ReqResult<Snippet>> snippetsGet(int taskGroupId, int lang1Id, int lang2Id);
Mono<ReqResult<Snippet>> snippetsGetByCode(String taskGroupCode, String lang1Code, String lang2Code);
Mono<ReqResult<SnippetIntern>> snippetGet(int snId);
Mono<ReqResult<Language>> languagesGet();
Mono<ReqResult<TaskGroup>> taskGroupsGet();
Mono<ReqResult<Proposal>> proposalsGet();
Mono<ReqResult<Task>> tasksFromGroupGet(int taskGroup);
Mono<ReqResult<TaskGroup>> taskGroupsForLangGet(int langId);
Mono<ReqResult<TaskGroup>> taskGroupsForLangsGet(int lang1, int lang2);
Mono<ReqResult<Alternative>> alternativesForTLGet(int taskLanguageId);
Mono<ReqResult<Alternative>> alternativesForUserGet(int taskLanguageId, int userId);
Mono<ReqResult<Comment>> commentsGet(int snippetId);
Mono<Integer> proposalCreate(ProposalCreate dto, int authorId);
Mono<Integer> proposalUpdate(ProposalUpdate dto);

Mono<Integer> snippetApprove(int sn);
Mono<Integer> snippetDecline(int sn);
Mono<Integer> snippetMarkPrimary(int tlId, int snId);
Mono<ReqResult<Task>> taskGet(int taskId);
Mono<ReqResult<Task>> taskForTLGet(int taskLanguageId);

Mono<ReqResult<TaskCUIntern>> tasksAll();
Mono<Integer> taskGroupCU(TaskGroupCU dto);
Mono<ReqResult<TaskGroupCU>> taskGroupsAll();
Mono<ReqResult<LanguageCU>> languagesAll();
Mono<Integer> taskCU(TaskCU dto);
Mono<Integer> languageCU(LanguageCU dto);
Mono<ReqResult<Stats>> statsForAdmin();
Mono<Long> userCount();

Mono<ReqResult<AuthenticateIntern>> userAuthentGet(String userName);
Mono<ReqResult<AuthorizeIntern>> userAuthorizGet(int userId);
Mono<ReqResult<AuthorizeIntern>> userAdminAuthoriz();
Mono<Integer> userUpdateExpiration(int userId, String newToken, LocalDateTime newDate);
Mono<Integer> userRegister(UserNewIntern user);
Mono<Integer> userUpdate(UserNewIntern user);
Mono<Integer> userVote(int userId, int tlId, int snId);
Mono<ReqResult<Profile>> userProfile(int userId);
Mono<ReqResult<User>> userData(int userId);
Mono<Integer> commentCreate(int userId, int snId, String content, LocalDateTime ts);

Mono<Integer> logMessage(LocalDateTime ts, int msgType, String code, String message);

}
