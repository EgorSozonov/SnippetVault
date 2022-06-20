package tech.sozonov.SnippetVault.user;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;

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
public Mono<Either<String, HandshakeResponse>> userRegister(@RequestBody Register dto) {
    return userService.userRegister(dto);
}

@PostMapping("user/handshake")
public Mono<Either<String, HandshakeResponse>> userHandshake(@RequestBody Handshake dto, ServerHttpRequest req) {
    return userService.userHandshake(dto, req.getCookies());
}

@PostMapping("user/signIn")
public Mono<Either<String, SignInResponse>> userSignIn(@RequestBody SignIn dto, ServerWebExchange webEx) {
    return userService.userSignIn(dto, webEx);
}


}
