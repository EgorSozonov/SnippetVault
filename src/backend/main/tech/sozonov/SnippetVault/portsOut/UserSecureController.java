package tech.sozonov.SnippetVault.portsOut;
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
import tech.sozonov.SnippetVault.core.AuthService;
import tech.sozonov.SnippetVault.core.DataService;
import tech.sozonov.SnippetVault.core.DTO.AuthDTO.ChangePw;
import tech.sozonov.SnippetVault.core.DTO.AuthDTO.SignInSuccess;
import tech.sozonov.SnippetVault.core.DTO.AuxDTO.TaskCU;
import tech.sozonov.SnippetVault.core.DTO.SnippetDTO.ProposalCreate;
import tech.sozonov.SnippetVault.core.DTO.UserDTO.CommentCU;
import tech.sozonov.SnippetVault.core.DTO.UserDTO.Vote;


@RestController
@RequestMapping("/api/secure")
public class UserSecureController {


@GetMapping("user/profile")
public Mono<Profile> userProfile() {
    HttpContext.Request.Headers.TryGetValue("userId", out var mbUserId);
    int.TryParse(mbUserId[0].ToString(), out int userId);
    var result = await api.userProfile(userId);
    await sendQueryResult<ProfileDTO>(result, HttpContext.Response);
}

@PostMapping("user/changePw")
public Mono<SignInSuccess> userChangePw(@RequestBody ChangePw dto) {
    var result = await auth.userUpdatePw(dto, HttpContext.Response.Cookies);
    await sendQueryResult<SignInSuccessDTO>(result, HttpContext.Response);
}

@PostMapping("user/vote")
public Mono<ResponseEntity> userVote(@RequestBody Vote dto) {
    HttpContext.Request.Headers.TryGetValue("userId", out var mbUserId);
    int.TryParse(mbUserId[0].ToString(), out int userId);
    await applyPostRequest(api.userVote(dto, userId), HttpContext.Response);
}

@PostMapping("comment/cu")
public Mono<ResponseEntity> commentCreate(@RequestBody CommentCU dto) {
    HttpContext.Request.Headers.TryGetValue("userId", out var mbUserId);
    int.TryParse(mbUserId[0].ToString(), out int userId);
    await applyPostRequest(api.commentCreate(dto, userId), HttpContext.Response);
}
}
