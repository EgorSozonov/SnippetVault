package tech.sozonov.SnippetVault.snippet;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.cmn.dto.CommonDTO.TaskGroup;
import tech.sozonov.SnippetVault.cmn.internal.InternalTypes.SnippetIntern;
import tech.sozonov.SnippetVault.snippet.SnippetDTO.*;

public interface ISnippetStore {


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

Mono<Task> taskGet(int taskId);
Mono<Task> taskForTLGet(int taskLanguageId);
Mono<Integer> proposalCreate(ProposalCreate dto, int authorId);


}
