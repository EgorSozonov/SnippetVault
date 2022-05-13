package tech.sozonov.SnippetVault.admin;
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
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.core.AuthService;
import tech.sozonov.SnippetVault.core.DTO.AuthDTO.*;
import tech.sozonov.SnippetVault.core.DTO.AuxDTO.*;
import tech.sozonov.SnippetVault.core.DTO.SnippetDTO.*;
import tech.sozonov.SnippetVault.snippet.core.DataService;


@RestController
@RequestMapping("/api/admin")
public class AdminSecureController {

@PostMapping("task/cu")
public Mono<ResponseEntity> taskCreateUpdate(@RequestBody TaskCU dto) {
    if (dto == null) return;
    await applyPostRequest(api.taskCU(dto), HttpContext.Response);
}

@PostMapping("language/cu")
public Mono<ResponseEntity> languageCreateUpdate(@RequestBody LanguageCU dto) {
    if (dto == null) return;
    await applyPostRequest(api.languageCU(dto), HttpContext.Response);
}

@PostMapping("taskGroup/cu")
public Mono<List<TaskGroup>> taskGroupCreateUpdate(@RequestBody TaskGroupCU dto) {
    if (dto == null) return;
    await applyPostRequest(api.taskGroupCU(dto), HttpContext.Response);
}

@PostMapping("proposal/update")
public Mono<ResponseEntity> proposalUpdate(@RequestBody ProposalUpdate dto) {
    await applyPostRequest(api.proposalUpdate(dto), HttpContext.Response);
}


@PostMapping("snippet/approve/{snId}")
public Mono<ResponseEntity> snippetApprove(@PathVariable("snId") int snId) {
    await applyPostRequest(api.snippetApprove(snId), HttpContext.Response);
}


@PostMapping("snippet/decline/{snId}")
public Mono<ResponseEntity> snippetDecline(@PathVariable("snId") int snId) {
    await applyPostRequest(api.snippetDecline(snId), HttpContext.Response);
}

@PostMapping("snippet/markPrimary/{tlId}/{snId}")
public Mono<ResponseEntity> snippetMarkPrimary(@PathVariable("tlId") int tlId, @PathVariable("snId") int snId) {
    await applyPostRequest(api.snippetMarkPrimary(tlId, snId), HttpContext.Response);
}

@PostMapping("changeAdminPw")
public Mono<SignInSuccess> userChangeAdminPw(@RequestBody ChangePwAdmin dto) {
    var result = await auth.userUpdateAdminPw(dto, HttpContext.Response.Cookies);
    await sendQueryResult<SignInSuccessDTO>(result, HttpContext.Response);
}



}
