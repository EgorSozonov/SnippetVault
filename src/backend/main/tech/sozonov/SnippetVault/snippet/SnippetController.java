package tech.sozonov.SnippetVault.snippet;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.snippet.SnippetDTO.*;

@RestController
@RequestMapping("/api")
public class SnippetController {


private final SnippetService snippetService;

@Autowired
public SnippetController(SnippetService _snippetService) {
    this.snippetService = _snippetService;
}

@GetMapping("languages")
public Flux<Language> languages() {
    return snippetService.languagesGet();
}

@GetMapping("taskGroups")
public Flux<TaskGroup> taskGroups() {
    return snippetService.taskGroupsGet();
}

@GetMapping("taskGroupsForLanguage/{langId}")
public Mono<List<TaskGroup>> taskGroupsForLanguage(@PathVariable("langId") int langId) {
    return snippetService.taskGroupsForLangGet(langId);
}

@GetMapping("taskGroupsForLanguages/{langId1}/{langId2}")
public Mono<List<TaskGroup>> taskGroupsForLanguages(@PathVariable("langId1") int langId1, @PathVariable("langId2") int langId2) {
    return snippetService.taskGroupsForLangsGet(langId1, langId2);
}

@GetMapping("task/{taskId}")
public Mono<Task> task(@PathVariable("taskId") int taskId) {
    return snippetService.taskGet(taskId);
}

@GetMapping("snippets/{taskGroup}/{lang1}/{lang2}")
public Mono<List<Snippet>> snippets(@PathVariable("taskGroup") int taskGroup,
                     @PathVariable("lang1") int lang1,
                     @PathVariable("lang2") int lang2) {
    var result = await api.snippetsGet(taskGroup, lang1, lang2);
    await sendQueryResult<SnippetDTO>(result, HttpContext.Response);
}

@GetMapping("snippets/byCode")
public Mono<List<Snippet>> snippetsByCode(@RequestParam String taskGroup, @RequestParam String lang1, @RequestParam String lang2) {
    var result = await api.snippetsGetByCode(taskGroup, lang1, lang2);
    await sendQueryResult<SnippetDTO>(result, HttpContext.Response);
}

@GetMapping("snippet/{snId}")
public Mono<BareSnippet> proposalGet(@PathVariable("snId") int snId) {
    var result = await api.proposalGet(snId);
    await sendQueryResult<BareSnippetDTO>(result, HttpContext.Response);
}

@GetMapping("proposals")
public Task proposals() {
    var result = await api.proposalsGet();
    await sendQueryResult<ProposalDTO>(result, HttpContext.Response);
}

@GetMapping("alternatives/{tlId:int}")
public Mono<List<Alternative>> alternatives(@PathVariable int tlId) {
    var result = await api.alternativesForTLGet(tlId, null);
    await sendQueryResult<AlternativesDTO>(result, HttpContext.Response);
}

@GetMapping("alternativesForUser/{tlId:int}/{userId:int}")
public Mono<List<Alternative>> alternativesForUser(@PathVariable int tlId, @PathVariable int userId) {
    var result = await api.alternativesForTLGet(tlId, userId);
    await sendQueryResult<AlternativesDTO>(result, HttpContext.Response);
}

@GetMapping("health")
public Mono<String> healthCheck() {
    await HttpContext.Response.WriteAsync("SnippetVault backend running at " + DateTime.Now);
}

// private static Task readResultSet<T>(NpgsqlDataReader reader, HttpResponse response) where T : class, new() {
//     try {
//         String[] columnNames = new String[reader.FieldCount];
//         for (int i = 0; i < reader.FieldCount; ++i) {
//             columnNames[i] = reader.GetName(i);
//         }
//         var readerSnippet = new DBDeserializer<T>(columnNames);
//         if (!readerSnippet.isOK)  {
//             await response.WriteAsync("Error");
//             return;
//         }

//         var results = readerSnippet.readResults(reader, out String errMsg);
//         if (errMsg != "") {
//             await response.WriteAsync(errMsg);
//             return;
//         }
//         await response.WriteAsJsonAsync<List<T>>(results);
//         return;
//     } catch (Exception e) {
//         Console.WriteLine(e.Message);
//         await response.WriteAsync("Exception");
//         return;
//     }
// }
}
