package tech.sozonov.SnippetVault.admin;
import lombok.val;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.admin.AdminDTO.*;
import tech.sozonov.SnippetVault.cmn.internal.InternalTypes.SnippetStatus;
import tech.sozonov.SnippetVault.cmn.utils.Types.SelectChoice;
import tech.sozonov.SnippetVault.snippet.SnippetService;
import static tech.sozonov.SnippetVault.cmn.utils.Strings.*;

public class AdminService {


private final IAdminStore adminStore;
private final SnippetService snippetService;

public AdminService(IAdminStore adminStore, SnippetService _snippetService) {
    this.adminStore = adminStore;
    this.snippetService = _snippetService;
}

public Flux<TaskCU> tasksAll() {
    val tasksIntern = adminStore.tasksAll();
    return tasksIntern.map(x -> new TaskCU(x.name, x.description, new SelectChoice(x.taskGroupId, x.taskGroupName), x.existingId, x.isDeleted));
}

public Flux<TaskGroupCU> taskGroupsAll() {
    return adminStore.taskGroupsAll();
}

public Flux<LanguageCU> languagesAll() {
    return adminStore.languagesAll();
}

public Mono<Integer> taskGroupCU(TaskGroupCU dto) {
    if (dto.name == null || dto.code == null || dto.name.length()*dto.code.length() == 0) return Mono.just(-1);
    return adminStore.taskGroupCU(dto);
}

public Mono<Integer> taskCU(TaskCU dto) {
    if (nullOrEmp(dto.name) || nullOrEmp(dto.description)) return Mono.just(-1);
    return adminStore.taskCU(dto);
}

public Mono<Integer> languageCU(LanguageCU dto) {
    if (nullOrEmp(dto.name) || nullOrEmp(dto.code)) return Mono.just(-1);
    return adminStore.languageCU(dto);
}

public Mono<Integer> proposalUpdate(ProposalUpdate dto) {
    if (dto.existingId < 0 || nullOrEmp(dto.content)) return Mono.just(-1);
    return adminStore.proposalUpdate(dto);
}

public Mono<Integer> snippetApprove(int snId) {
    if (snId < 0) return Mono.just(-1);
    return adminStore.snippetApprove(snId);
}

public Mono<Integer> snippetDecline(int snId) {
    if (snId < 0) return Mono.just(-1);
    return adminStore.snippetDecline(snId);
}

public Mono<Integer> snippetMarkPrimary(int tlId, int snId) {
    val snippet = snippetService.snippetGet(snId);
    return snippet.flatMap(x -> (x.status == SnippetStatus.Approved && x.taskLanguageId == tlId) ? adminStore.snippetMarkPrimary(tlId, snId) : Mono.just(-1));
    //return snippet.map(x -> (x.status == SnippetStatus.Approved && existingSnip.taskLanguageId == tlId) ? adminStore.snippetMarkPrimary(tlId, snId) : -1);
}

public Mono<Stats> statsForAdmin() {
    val result = adminStore.statsForAdmin();
    val userCount = adminStore.userCount().block();
    return result.map(x -> {
            x.userCount = userCount;
            return x;
        });
}

}
