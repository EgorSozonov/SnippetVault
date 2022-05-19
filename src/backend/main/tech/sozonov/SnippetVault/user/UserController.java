package tech.sozonov.SnippetVault.user;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
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
public Mono<SignInSuccess> userRegister(@RequestBody SignIn dto) {
    return userService.userRegister(dto, HttpContext.Response.Cookies);
}

@PostMapping("user/signIn")
public Mono<SignInSuccess> userSignIn(@RequestBody SignIn dto) {
    return userService.userAuthenticate(dto, HttpContext.Response.Cookies);
    sendQueryResult<SignInSuccess>(result, HttpContext.Response, 401);
}

@PostMapping("user/signInAdmin")
public Mono<SignInSuccess> userSignInAdmin(@RequestBody SignInAdmin dto) {
    var result = userService.userAuthenticateAdmin(dto, HttpContext.Response.Cookies);
    sendQueryResult<SignInSuccess>(result, HttpContext.Response, 401);
}

@PostMapping("changeAdminPw")
public Mono<SignInSuccess> userChangeAdminPw(@RequestBody ChangePwAdmin dto) {
    return userService.userUpdateAdminPw(dto, HttpContext.Response.Cookies);
}


}
