package tech.sozonov.SnippetVault.user;
import java.util.List;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.cmn.utils.Either;
import tech.sozonov.SnippetVault.user.UserDTO.*;

@RestController
@RequestMapping("/api")
public class UserController {


private UserService userService;

public UserController(UserService _userService) {
    userService = _userService;
}

@GetMapping("comments/{snId}")
public Flux<Comment> comments(@PathVariable("snId") int snId) {
    return userService.commentsGet(snId);
}

@PostMapping("user/register")
public Mono<Either<String, SignInSuccess>> userRegister(@RequestBody SignIn dto, ServerHttpRequest req) {
    return userService.userRegister(dto, req.getCookies());
}

@PostMapping("user/signIn")
public Mono<Either<String, SignInSuccess>> userSignIn(@RequestBody SignIn dto, ServerHttpRequest req) {
    return userService.userAuthenticate(dto, req.getCookies());
}

@PostMapping("user/signInAdmin")
public Mono<Either<String, SignInSuccess>> userSignInAdmin(@RequestBody SignInAdmin dto, ServerHttpRequest req) {
    return userService.userAuthenticateAdmin(dto, req.getCookies());
}

@PostMapping("changeAdminPw")
public Mono<Either<String, SignInSuccess>> userChangeAdminPw(@RequestBody ChangePwAdmin dto, ServerHttpRequest req) {
    return userService.userUpdateAdminPw(dto, req.getCookies());
}


}
