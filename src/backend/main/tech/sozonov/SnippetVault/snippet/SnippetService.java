package tech.sozonov.SnippetVault.snippet;
import java.util.HashSet;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.val;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.cmn.dto.CommonDTO.TaskGroup;
import tech.sozonov.SnippetVault.cmn.internal.InternalTypes.SnippetIntern;
import tech.sozonov.SnippetVault.cmn.utils.Either;
import tech.sozonov.SnippetVault.snippet.SnippetDTO.*;
import static tech.sozonov.SnippetVault.cmn.utils.Strings.*;

@Service
public class SnippetService {


private final ISnippetStore snippetStore;

@Autowired
public SnippetService(ISnippetStore _snippetStore) {
    this.snippetStore = _snippetStore;
}

public Mono<Task> taskGet(int taskId) {
    return snippetStore.taskGet(taskId);
}

public Flux<Language> languagesGet() {
    return snippetStore.languagesGet();
}

public Flux<TaskGroup> taskGroupsForLangGet(int langId) {
    return snippetStore.taskGroupsForLangGet(langId);
}

public Flux<TaskGroup> taskGroupsForLangsGet(int lang1, int lang2) {
    return snippetStore.taskGroupsForLangsGet(lang1, lang2);
}

public Flux<TaskGroup> taskGroupsGet() {
    return snippetStore.taskGroupsGet();
}

public Flux<Snippet> snippetsGet(int taskGroup, int lang1, int lang2) {
    return snippetStore.snippetsGet(taskGroup, lang1, lang2);
}

public Flux<Snippet> snippetsGetByCode(String taskGroup, String lang1, String lang2) {
    return snippetStore.snippetsGetByCode(taskGroup, lang1, lang2);
}

public Flux<Proposal> proposalsGet() {
    return snippetStore.proposalsGet();
}

public Mono<BareSnippet> proposalGet(int snId) {
    val snippetIntern = snippetStore.snippetGet(snId);
    return snippetIntern.map(x -> new BareSnippet(x.content, x.libraries));
}

public Mono<Integer> proposalCreate(ProposalCreate dto, String authorName) {
    return snippetStore.proposalCreate(dto, authorName);
}

public Mono<SnippetIntern> snippetGet(int snId) {
    return snippetStore.snippetGet(snId);
}

public Mono<Either<String, Alternatives>> alternativesForTLGet(int taskLanguageId, String userName){
    val allAlternatives = (nullOrEmp(userName)
                            ? snippetStore.alternativesForTLGet(taskLanguageId)
                            : snippetStore.alternativesForUserGet(taskLanguageId, userName)
                          ).collectList();
    val mbTask = snippetStore.taskForTLGet(taskLanguageId);

    return allAlternatives.zipWith(mbTask, (alts, task) -> {
            val uniques = new HashSet<Integer>();
            Alternative primary = null;

            for (val alt : alts) {
                if (uniques.contains(alt.id)) {
                    primary = alt;
                    break;
                }
                uniques.add(alt.id);
            }
            if (primary != null) {
                final int primaryId = primary.id;
                return Either.right(new Alternatives(primary, alts.stream().filter(x -> x.id != primaryId).collect(Collectors.toList()), task));
            } else {
                return Either.left("Error: no primary alternative was found");
            }
        }
    );

}


}
