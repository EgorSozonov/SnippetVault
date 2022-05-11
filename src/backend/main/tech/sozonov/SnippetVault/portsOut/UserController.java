package tech.sozonov.SnippetVault.portsOut;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
public class UserController {


@GetMapping("comments/{snId}")
public Mono<List<Comment>> comments(@PathVariable("snId") int snId) {
    var result = await api.commentsGet(snId);
    await sendQueryResult<CommentDTO>(result, HttpContext.Response);
}

@PostMapping("user/register")
public Mono<SignInSuccess> userRegister(@RequestBody SignInDTO dto) {
    var result = await auth.userRegister(dto, HttpContext.Response.Cookies);
    await sendQueryResult<SignInSuccessDTO>(result, HttpContext.Response);
}

@PostMapping("user/signIn")
public Task userSignIn(@RequestBody SignInDTO dto) {
    var result = await auth.userAuthenticate(dto, HttpContext.Response.Cookies);
    await sendQueryResult<SignInSuccessDTO>(result, HttpContext.Response, 401);
}


@PostMapping("user/changePw")
[ServiceFilter(typeof(AuthorizeFilter))]
public Mono<SignInSuccess> userChangePw(@RequestBody ChangePw dto) {
    var result = await auth.userUpdatePw(dto, HttpContext.Response.Cookies);
    await sendQueryResult<SignInSuccessDTO>(result, HttpContext.Response);
}

@PostMapping("user/signInAdmin")
public Task userSignInAdmin(@RequestBody SignInAdminDTO dto) {
    var result = await auth.userAuthenticateAdmin(dto, HttpContext.Response.Cookies);
    await sendQueryResult<SignInSuccessDTO>(result, HttpContext.Response, 401);
}


@PostMapping("user/changeAdminPw")
[ServiceFilter(typeof(AuthorizeAdminFilter))]
public Task userChangeAdminPw(@RequestBody ChangePwAdminDTO dto) {
    var result = await auth.userUpdateAdminPw(dto, HttpContext.Response.Cookies);
    await sendQueryResult<SignInSuccessDTO>(result, HttpContext.Response);
}

[HttpPost]
[Route("user/vote")]
[ServiceFilter(typeof(AuthorizeFilter))]
public async Task userVote(@RequestBody VoteDTO dto) {
    HttpContext.Request.Headers.TryGetValue("userId", out var mbUserId);
    int.TryParse(mbUserId[0].ToString(), out int userId);
    await applyPostRequest(api.userVote(dto, userId), HttpContext.Response);
}

[HttpPost]
[Route("comment/cu")]
[ServiceFilter(typeof(AuthorizeFilter))]
public async Task commentCreate(@RequestBody CommentCUDTO dto) {
    HttpContext.Request.Headers.TryGetValue("userId", out var mbUserId);
    int.TryParse(mbUserId[0].ToString(), out int userId);
    await applyPostRequest(api.commentCreate(dto, userId), HttpContext.Response);
}

[HttpGet]
[Route("user/profile")]
[ServiceFilter(typeof(AuthorizeFilter))]
public async Task userProfile() {
    HttpContext.Request.Headers.TryGetValue("userId", out var mbUserId);
    int.TryParse(mbUserId[0].ToString(), out int userId);
    var result = await api.userProfile(userId);
    await sendQueryResult<ProfileDTO>(result, HttpContext.Response);
}
}
