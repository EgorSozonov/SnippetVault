package tech.sozonov.SnippetVault.user;
import static sozonov.SnippetVault.cmn.utils.Http.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.user.UserDTO.*;

@RestController
@RequestMapping("/api/secure")
public class UserSecureController {


private final UserService userService;
public UserSecureController(UserService _userService) {
    userService = _userService;
}

@GetMapping("user/profile")
public Mono<Profile> userProfile(@RequestHeader("userName") String userName) {
    return userService.userProfile(userName);
}

@PostMapping("user/changePw")
public Mono<ResponseEntity<Void>> userChangePw(@RequestBody Register dto, ServerWebExchange webEx) {
    return wrapCUResponse(userService.updatePw(dto, webEx));
}

@PostMapping("user/vote")
public Mono<ResponseEntity<Void>> userVote(@RequestBody Vote dto, @RequestHeader("userName") String userName) {
    return wrapCUResponse(userService.userVote(dto, userName));
}

@PostMapping("comment/cu")
public Mono<ResponseEntity<Void>> commentCU(@RequestBody CommentCU dto, @RequestHeader("userName") String userName) {
    return wrapCUResponse(userService.commentCU(dto, userName));
}


}
