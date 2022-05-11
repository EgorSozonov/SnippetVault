package tech.sozonov.SnippetVault.portsOut;
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
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.core.AuthService;
import tech.sozonov.SnippetVault.core.DataService;
import tech.sozonov.SnippetVault.core.DTO.SnippetDTO.ProposalCreate;


@RestController
@RequestMapping("/api")
public class SnippetController {

private final DataService api;
private final AuthService auth;

@Autowired
public SnippetController(DataService _api, AuthService _auth) {
    this.api = _api;
    this.auth = _auth;
}


@GetMapping("snippets/{taskGroup}/{lang1}/{lang2}")
public Task snippets(@PathVariable("taskGroup") int taskGroup,
                     @PathVariable("lang1") int lang1,
                     @PathVariable("lang2") int lang2) {
    var result = await api.snippetsGet(taskGroup, lang1, lang2);
    await sendQueryResult<SnippetDTO>(result, HttpContext.Response);
}


@GetMapping("snippets/byCode")
public Task snippetsByCode(@RequestParam String taskGroup, @RequestParam String lang1, @RequestParam String lang2) {
    var result = await api.snippetsGetByCode(taskGroup, lang1, lang2);
    await sendQueryResult<SnippetDTO>(result, HttpContext.Response);
}


@PostMapping("proposal/create")
[ServiceFilter(typeof(AuthorizeFilter))]
public Mono<ResponseEntity> proposalCreate(@RequestBody ProposalCreate dto) {
    HttpContext.Request.Headers.TryGetValue("userId", out var mbUserId);
    int.TryParse(mbUserId[0].ToString(), out int userId);
    await applyPostRequest(api.proposalCreate(dto, userId), HttpContext.Response);
}


@PostMapping("proposal/update")
[ServiceFilter(typeof(AuthorizeAdminFilter))]
public Task proposalUpdate(@RequestBody ProposalUpdate dto) {
    await applyPostRequest(api.proposalUpdate(dto), HttpContext.Response);
}

@GetMapping("snippet/{snId}")
public Task proposalGet(@PathVariable("snId") int snId) {
    var result = await api.proposalGet(snId);
    await sendQueryResult<BareSnippetDTO>(result, HttpContext.Response);
}

@PostMapping("snippet/approve/{snId}")
[ServiceFilter(typeof(AuthorizeAdminFilter))]
public Task snippetApprove(@PathVariable("snId") int snId) {
    await applyPostRequest(api.snippetApprove(snId), HttpContext.Response);
}


@PostMapping("snippet/decline/{snId}")
[ServiceFilter(typeof(AuthorizeAdminFilter))]
public Task snippetDecline(@PathVariable("snId") int snId) {
    await applyPostRequest(api.snippetDecline(snId), HttpContext.Response);
}

@PostMapping("snippet/markPrimary/{tlId}/{snId}")
[ServiceFilter(typeof(AuthorizeAdminFilter))]
public Task snippetMarkPrimary(@PathVariable("tlId") int tlId, @PathVariable("snId") int snId) {
    await applyPostRequest(api.snippetMarkPrimary(tlId, snId), HttpContext.Response);
}

@GetMapping("proposals")
public Task proposals() {
    var result = await api.proposalsGet();
    await sendQueryResult<ProposalDTO>(result, HttpContext.Response);
}

@GetMapping("alternatives/{tlId:int}")
public Task alternatives(@PathVariable int tlId) {
    var result = await api.alternativesForTLGet(tlId, null);
    await sendQueryResult<AlternativesDTO>(result, HttpContext.Response);
}

@GetMapping("alternativesForUser/{tlId:int}/{userId:int}")
public Task alternativesForUser(@PathVariable int tlId, @PathVariable int userId) {
    var result = await api.alternativesForTLGet(tlId, userId);
    await sendQueryResult<AlternativesDTO>(result, HttpContext.Response);
}

@GetMapping("health")
public Task healthCheck() {
    await HttpContext.Response.WriteAsync("SnippetVault backend running at " + DateTime.Now);
}

private static Task readResultSet<T>(NpgsqlDataReader reader, HttpResponse response) where T : class, new() {
    try {
        String[] columnNames = new String[reader.FieldCount];
        for (int i = 0; i < reader.FieldCount; ++i) {
            columnNames[i] = reader.GetName(i);
        }
        var readerSnippet = new DBDeserializer<T>(columnNames);
        if (!readerSnippet.isOK)  {
            await response.WriteAsync("Error");
            return;
        }

        var results = readerSnippet.readResults(reader, out String errMsg);
        if (errMsg != "") {
            await response.WriteAsync(errMsg);
            return;
        }
        await response.WriteAsJsonAsync<List<T>>(results);
        return;
    } catch (Exception e) {
        Console.WriteLine(e.Message);
        await response.WriteAsync("Exception");
        return;
    }
}
}
