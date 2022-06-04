package tech.sozonov.SnippetVault.user;
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



// @PostMapping("foo")
// public Mono<Void> foo(@RequestParam String login, @RequestParam String salt, @RequestParam String verifier) {
//     return userService.userUpdateAdminPw(dto, req.getCookies());
// }
// 21766174458617435773191008891802753781907668374255538511144643224689886235383840957210909013086056401571399717235807266581649606472148410291413364152197364477180887395655483738115072677402235101762521901569820740293149529620419333266262073471054548368736039519702486226506248861060256971802984953561121442680157668000761429988222457090413873973970171927093992114751765168063614761119615476233422096442783117971236371647333871414335895773474667308967050807005509320424799678417036867928316761272274230314067548291133582479583061439577559347101961771406173684378522703483495337037655006751328447510550299250924469288819
}
