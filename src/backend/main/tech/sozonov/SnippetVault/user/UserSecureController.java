package tech.sozonov.SnippetVault.user;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
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
import tech.sozonov.SnippetVault.user.UserDTO.*;

@RestController
@RequestMapping("/api/secure")
public class UserSecureController {


private final UserService userService;
public UserSecureController(UserService _userService) {
    userService = _userService;
}

@GetMapping("user/profile")
public Mono<Profile> userProfile() {
    HttpContext.Request.Headers.TryGetValue("userId", out var mbUserId);
    int.TryParse(mbUserId[0].ToString(), out int userId);
    var result = userService.userProfile(userId);
    sendQueryResult<ProfileDTO>(result, HttpContext.Response);
}

@PostMapping("user/changePw")
public Mono<SignInSuccess> userChangePw(@RequestBody ChangePw dto) {
    var result = auth.userUpdatePw(dto, HttpContext.Response.Cookies);
    sendQueryResult<SignInSuccessDTO>(result, HttpContext.Response);
}

@PostMapping("user/vote")
public Mono<ResponseEntity<Void>> userVote(@RequestBody Vote dto) {
    HttpContext.Request.Headers.TryGetValue("userId", out var mbUserId);
    int.TryParse(mbUserId[0].ToString(), out int userId);
    applyPostRequest(userService.userVote(dto, userId), HttpContext.Response);
}

@PostMapping("comment/cu")
public Mono<ResponseEntity<Void>> commentCreate(@RequestBody CommentCU dto) {
    HttpContext.Request.Headers.TryGetValue("userId", out var mbUserId);
    int.TryParse(mbUserId[0].ToString(), out int userId);
    applyPostRequest(userService.commentCreate(dto, userId), HttpContext.Response);
}
}
