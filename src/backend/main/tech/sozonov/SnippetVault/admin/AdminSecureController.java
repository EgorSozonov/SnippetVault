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
import tech.sozonov.SnippetVault.admin.AdminDTO.*;

@RestController
@RequestMapping("/api/admin")
public class AdminSecureController {


private AdminService adminService;

@Autowired
public AdminSecureController(AdminService _adminService) {
    adminService = _adminService;
}

@PostMapping("task/cu")
public Mono<ResponseEntity> taskCreateUpdate(@RequestBody TaskCU dto) {
    if (dto == null) return Mono.just(ResponseEntity.badRequest().build());
    return adminService.taskCU(dto);
}

@PostMapping("language/cu")
public Mono<ResponseEntity> languageCreateUpdate(@RequestBody LanguageCU dto) {
    if (dto == null) return Mono.just(ResponseEntity.badRequest().build());
    applyPostRequest(adminService.languageCU(dto), HttpContext.Response);
}

@PostMapping("taskGroup/cu")
public Mono<List<TaskGroupCU>> taskGroupCreateUpdate(@RequestBody TaskGroupCU dto) {
    if (dto == null) return;
    applyPostRequest(adminService.taskGroupCU(dto), HttpContext.Response);
}

@PostMapping("proposal/update")
public Mono<ResponseEntity> proposalUpdate(@RequestBody ProposalUpdate dto) {
    applyPostRequest(adminService.proposalUpdate(dto), HttpContext.Response);
}


@PostMapping("snippet/approve/{snId}")
public Mono<ResponseEntity> snippetApprove(@PathVariable("snId") int snId) {
    applyPostRequest(adminService.snippetApprove(snId), HttpContext.Response);
}


@PostMapping("snippet/decline/{snId}")
public Mono<ResponseEntity> snippetDecline(@PathVariable("snId") int snId) {
    applyPostRequest(adminService.snippetDecline(snId), HttpContext.Response);
}

@PostMapping("snippet/markPrimary/{tlId}/{snId}")
public Mono<ResponseEntity> snippetMarkPrimary(@PathVariable("tlId") int tlId, @PathVariable("snId") int snId) {
    applyPostRequest(adminService.snippetMarkPrimary(tlId, snId), HttpContext.Response);
}




}
