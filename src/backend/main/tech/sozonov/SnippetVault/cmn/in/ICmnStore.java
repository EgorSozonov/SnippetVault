package tech.sozonov.SnippetVault.portsIn;
import java.time.LocalDateTime;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.cmn.core.internal.InternalTypes.*;
import tech.sozonov.SnippetVault.core.DTO.AuxDTO.*;
import tech.sozonov.SnippetVault.core.DTO.SnippetDTO.*;
import tech.sozonov.SnippetVault.core.DTO.UserDTO.*;
import tech.sozonov.SnippetVault.core.utils.Types.ReqResult;


public interface IStore {

Flux<Snippet> snippetsGet(int taskGroupId, int lang1Id, int lang2Id);
Flux<Snippet> snippetsGetByCode(String taskGroupCode, String lang1Code, String lang2Code);
Mono<SnippetIntern> snippetGet(int snId);
Flux<Language> languagesGet();
Flux<TaskGroup> taskGroupsGet();
Flux<Proposal> proposalsGet();
Flux<Task> tasksFromGroupGet(int taskGroup);
Flux<TaskGroup> taskGroupsForLangGet(int langId);
Flux<TaskGroup> taskGroupsForLangsGet(int lang1, int lang2);
Flux<Alternative> alternativesForTLGet(int taskLanguageId);
Flux<Alternative> alternativesForUserGet(int taskLanguageId, int userId);
Flux<Comment> commentsGet(int snippetId);
Mono<Integer> proposalCreate(ProposalCreate dto, int authorId);
Mono<Integer> proposalUpdate(ProposalUpdate dto);

Mono<Integer> snippetApprove(int sn);
Mono<Integer> snippetDecline(int sn);
Mono<Integer> snippetMarkPrimary(int tlId, int snId);
Mono<Task> taskGet(int taskId);
Mono<Task> taskForTLGet(int taskLanguageId);

Flux<TaskCUIntern> tasksAll();
Mono<Integer> taskGroupCU(TaskGroupCU dto);
Flux<TaskGroupCU> taskGroupsAll();
Flux<LanguageCU> languagesAll();
Mono<Integer> taskCU(TaskCU dto);
Mono<Integer> languageCU(LanguageCU dto);
Mono<Stats> statsForAdmin();
Mono<Long> userCount();

Mono<AuthenticateIntern> userAuthentGet(String userName);
Mono<AuthorizeIntern> userAuthorizGet(int userId);
Mono<AuthorizeIntern> userAdminAuthoriz();
Mono<Integer> userUpdateExpiration(int userId, String newToken, LocalDateTime newDate);
Mono<Integer> userRegister(UserNewIntern user);
Mono<Integer> userUpdate(UserNewIntern user);
Mono<Integer> userVote(int userId, int tlId, int snId);
Mono<Profile> userProfile(int userId);
Mono<User> userData(int userId);
Mono<Integer> commentCreate(int userId, int snId, String content, LocalDateTime ts);

Mono<Integer> logMessage(LocalDateTime ts, int msgType, String code, String message);

}
