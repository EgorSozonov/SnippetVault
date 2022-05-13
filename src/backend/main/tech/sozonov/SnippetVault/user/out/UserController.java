package tech.sozonov.SnippetVault.user.out;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.core.DTO.AuthDTO.SignIn;
import tech.sozonov.SnippetVault.core.DTO.AuthDTO.SignInSuccess;
import tech.sozonov.SnippetVault.core.DTO.UserDTO.Comment;

@RestController
@RequestMapping("/api")
public class UserController {


@GetMapping("comments/{snId}")
public Mono<List<Comment>> comments(@PathVariable("snId") int snId) {
    var result = await api.commentsGet(snId);
    await sendQueryResult<CommentDTO>(result, HttpContext.Response);
}

@PostMapping("user/register")
public Mono<SignInSuccess> userRegister(@RequestBody SignIn dto) {
    var result = await auth.userRegister(dto, HttpContext.Response.Cookies);
    await sendQueryResult<SignInSuccessDTO>(result, HttpContext.Response);
}

@PostMapping("user/signIn")
public Mono<SignInSuccess> userSignIn(@RequestBody SignIn dto) {
    var result = await auth.userAuthenticate(dto, HttpContext.Response.Cookies);
    await sendQueryResult<SignInSuccessDTO>(result, HttpContext.Response, 401);
}

@PostMapping("user/signInAdmin")
public Mono<SignInSuccess> userSignInAdmin(@RequestBody SignInAdmin dto) {
    var result = await auth.userAuthenticateAdmin(dto, HttpContext.Response.Cookies);
    await sendQueryResult<SignInSuccessDTO>(result, HttpContext.Response, 401);
}







}
