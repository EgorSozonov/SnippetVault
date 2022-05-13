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
import tech.sozonov.SnippetVault.cmn.utils.Http;

import static tech.sozonov.SnippetVault.cmn.utils.Http.*;

@RestController
@RequestMapping("/api/admin")
public class AdminSecureController {


private AdminService adminService;

@Autowired
public AdminSecureController(AdminService _adminService) {
    adminService = _adminService;
}

@PostMapping("task/cu")
public Mono<ResponseEntity<Void>> taskCreateUpdate(@RequestBody TaskCU dto) {
    if (dto == null) return Http.BAD_REQUEST;
    return wrapCUResponse(adminService.taskCU(dto));
}

@PostMapping("language/cu")
public Mono<ResponseEntity<Void>> languageCreateUpdate(@RequestBody LanguageCU dto) {
    if (dto == null) return Http.BAD_REQUEST;
    return wrapCUResponse(adminService.languageCU(dto));
}

@PostMapping("taskGroup/cu")
public Mono<ResponseEntity<Void>> taskGroupCreateUpdate(@RequestBody TaskGroupCU dto) {
    if (dto == null) return Http.BAD_REQUEST;
    return wrapCUResponse(adminService.taskGroupCU(dto));
}

@PostMapping("proposal/update")
public Mono<ResponseEntity<Void>> proposalUpdate(@RequestBody ProposalUpdate dto) {
    return wrapCUResponse(adminService.proposalUpdate(dto));
}


@PostMapping("snippet/approve/{snId}")
public Mono<ResponseEntity<Void>> snippetApprove(@PathVariable("snId") int snId) {
    return wrapCUResponse(adminService.snippetApprove(snId));
}


@PostMapping("snippet/decline/{snId}")
public Mono<ResponseEntity<Void>> snippetDecline(@PathVariable("snId") int snId) {
    return wrapCUResponse(adminService.snippetDecline(snId));
}

@PostMapping("snippet/markPrimary/{tlId}/{snId}")
public Mono<ResponseEntity<Void>> snippetMarkPrimary(@PathVariable("tlId") int tlId, @PathVariable("snId") int snId) {
    return wrapCUResponse(adminService.snippetMarkPrimary(tlId, snId));
}




}
