package tech.sozonov.SnippetVault.admin.in;
import java.time.LocalDateTime;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.admin.core.AdminDTO.*;
import tech.sozonov.SnippetVault.cmn.core.internal.InternalTypes.*;


public interface IAdminStore {



Mono<Integer> snippetApprove(int sn);
Mono<Integer> snippetDecline(int sn);
Mono<Integer> snippetMarkPrimary(int tlId, int snId);
Mono<Integer> proposalUpdate(ProposalUpdate dto);

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


Mono<Integer> logMessage(LocalDateTime ts, int msgType, String code, String message);


}
