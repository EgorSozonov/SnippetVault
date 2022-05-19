package tech.sozonov.SnippetVault.snippet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.snippet.SnippetDTO.*;

@RestController
@RequestMapping("/api/secure")
public class SnippetSecureController {


private final SnippetService snippetService;

@Autowired
public SnippetSecureController(SnippetService _snippetService) {
    this.snippetService = _snippetService;
}

@PostMapping("proposal/create")
public Mono<ResponseEntity<Void>> proposalCreate(@RequestBody ProposalCreate dto, @RequestHeader("userId") int userId) {
    return snippetService.proposalCreate(dto, userId);
}


}
