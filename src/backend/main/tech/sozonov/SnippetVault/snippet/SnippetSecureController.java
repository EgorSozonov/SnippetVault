package tech.sozonov.SnippetVault.snippet;
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
import tech.sozonov.SnippetVault.snippet.SnippetDTO.*;


@RestController
@RequestMapping("/api/secure")
public class SnippetSecureController {

@PostMapping("proposal/create")
public Mono<ResponseEntity<Void>> proposalCreate(@RequestBody ProposalCreate dto) {
    HttpContext.Request.Headers.TryGetValue("userId", out var mbUserId);
    int.TryParse(mbUserId[0].ToString(), out int userId);
    applyPostRequest(api.proposalCreate(dto, userId), HttpContext.Response);
}


}
