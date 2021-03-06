package tech.sozonov.SnippetVault.admin;
import static tech.sozonov.SnippetVault.cmn.utils.Http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.cmn.utils.Http;
import tech.sozonov.SnippetVault.admin.AdminDTO.*;
import tech.sozonov.SnippetVault.user.UserService;
import tech.sozonov.SnippetVault.user.UserDTO.Register;

@RestController
@RequestMapping("/api/admin")
public class AdminSecureController {


private AdminService adminService;
private UserService userService;

@Autowired
public AdminSecureController(AdminService _adminService, UserService _userService) {
    adminService = _adminService;
    userService = _userService;
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

@PostMapping("changePw")
public Mono<ResponseEntity<Void>> changePw(@RequestBody Register dto, ServerWebExchange webEx) {
    return wrapCUResponse(userService.updatePw(dto, webEx));
}


}
