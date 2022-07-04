package tech.sozonov.SnippetVault.snippet;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import sozonov.SnippetVault.cmn.dto.CommonDTO.TaskGroup;
import sozonov.SnippetVault.cmn.internal.InternalTypes.SnippetIntern;
import tech.sozonov.SnippetVault.snippet.SnippetDTO.*;

public interface ISnippetStore {


Flux<Snippet> snippetsGet(int taskGroupId, int lang1Id, int lang2Id);
Flux<Snippet> snippetsGetByCode(String taskGroupCode, String lang1Code, String lang2Code);
Mono<SnippetIntern> snippetGet(int snId);
Flux<Language> languagesGet();
Flux<TaskGroup> taskGroupsGet();
Flux<Proposal> proposalsGet();
Flux<TaskGroup> taskGroupsForLangGet(int langId);
Flux<TaskGroup> taskGroupsForLangsGet(int lang1, int lang2);
Flux<Alternative> alternativesForTLGet(int taskLanguageId);
Flux<Alternative> alternativesForUserGet(int taskLanguageId, String userName);

Mono<Task> taskGet(int taskId);
Mono<Task> taskForTLGet(int taskLanguageId);
Mono<Integer> proposalCreate(ProposalCreate dto, String authorName);


}
