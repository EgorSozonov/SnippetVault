package tech.sozonov.SnippetVault.snippet;
import java.util.HashSet;

import org.springframework.beans.factory.annotation.Autowired;
import lombok.val;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.cmn.internal.InternalTypes.SnippetIntern;
import tech.sozonov.SnippetVault.snippet.SnippetDTO.*;

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

public Mono<SnippetIntern> snippetGet(int snId) {
    return snippetStore.snippetGet(snId);
}

public Mono<Alternatives> alternativesForTLGet(int taskLanguageId, Integer userId){
    val allAlternatives = userId == null ? snippetStore.alternativesForTLGet(taskLanguageId) : snippetStore.alternativesForUserGet(taskLanguageId, (int)userId);
    val mbTask = snippetStore.taskForTLGet(taskLanguageId);
    return allAlternatives.zipWith(mbTask.cache().repeat(), (alts, task) -> {
        val uniques = new HashSet<Integer>();
        Alternative primary = null;
        int primaryId = -1;
        for (alt : alts) {

        }
    });
    if (allAlternatives is Success<AlternativeDTO> succ && mbTask is Success<TaskDTO> task) {
        var uniques = new HashSet<Integer>();
        AlternativeDTO primary = null;
        int primaryId = -1;
        foreach (var alt in succ.vals) {
            if (uniques.Contains(alt.id)) {
                primary = alt;
                primaryId = alt.id;
                break;
            }
            uniques.Add(alt.id);
        }
        if (primary != null) {
            return new Success<AlternativesDTO>(
                new List<AlternativesDTO>() {
                    new AlternativesDTO() {
                        primary = primary,
                        task = task.vals[0],
                        rows = succ.vals.Where(x => x.id != primaryId).ToArray(),
                    }
                }
            );
        } else {
            return new Err<AlternativesDTO>("Error: no primary alternative was found");
        }
    } else {
        return new Err<AlternativesDTO>("Error: no alternatives found");
    }
}


}
