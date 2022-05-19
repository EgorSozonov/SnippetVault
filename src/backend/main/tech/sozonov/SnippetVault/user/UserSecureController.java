package tech.sozonov.SnippetVault.user;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.cmn.utils.Either;
import tech.sozonov.SnippetVault.user.UserDTO.*;
import static tech.sozonov.SnippetVault.cmn.utils.Http.*;

@RestController
@RequestMapping("/api/secure")
public class UserSecureController {


private final UserService userService;
public UserSecureController(UserService _userService) {
    userService = _userService;
}

@GetMapping("user/profile")
public Mono<Profile> userProfile(@RequestHeader("userId") int userId) {
    return userService.userProfile(userId);
}

@PostMapping("user/changePw")
public Mono<Either<String, SignInSuccess>> userChangePw(@RequestBody ChangePw dto, ServerHttpRequest request) {
    return userService.userUpdatePw(dto, request.getCookies());
}

@PostMapping("user/vote")
public Mono<ResponseEntity<Void>> userVote(@RequestBody Vote dto, @RequestHeader("userId") int userId) {
    return wrapCUResponse(userService.userVote(dto, userId));
}

@PostMapping("comment/cu")
public Mono<ResponseEntity<Void>> commentCreate(@RequestBody CommentCU dto, @RequestHeader("userId") int userId) {
    return wrapCUResponse(userService.commentCreate(dto, userId));
}


}
