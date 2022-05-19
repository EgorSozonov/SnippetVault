package tech.sozonov.SnippetVault.user;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.val;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.UUID;
import java.util.list;
import tech.sozonov.SnippetVault.user.UserDTO.*;
import tech.sozonov.SnippetVault.cmn.utils.Either;

public class UserService {


private final IUserStore userStore;
private static final errResponse = Mono.just(Either.left("Authentication error"));

@Autowired
public UserService(IUserStore _userStore) {
    this.userStore = _userStore;
}


public Mono<Either<String, SignInSuccess>> userRegister(SignIn dto, MultiValueMap<String, HttpCookie> cookies) {
    // TODO
    return Mono.just(Either.left("TODO userRegister"));

    // if (!validatePasswordComplexity(dto.password)) {
    //     return Mono.just(Either.left("Error! Password length must be at least 8 symbols"));
    // }

    // String newSalt = "";
    // val newHashSalt = (dto.userName != AdminPasswordChecker.adminName)
    //     ? PasswordChecker.makeHash(dto.password) : AdminPasswordChecker.makeHash(dto.password);
    // val newAccessToken = makeAccessToken();
    // val user = UserNewIntern.builder()
    //     .userName(dto.userName).hash(newHash).salt(newSalt)
    //     .accessToken(newAccessToken)
    //     .dtExpiration(DateOnly.FromDateTime(DateTime.Today))
    // .build();
    // val newUserId = userStore.userRegister(user).get();
    // if (newUserId > 0) {
    //     val successList =  List.of(new SignInSuccess(newUserId));
    //     // TODO Secure
    //     cookies.Append("accessToken", newAccessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });

    //     return new Success<SignInSuccessDTO>(successList);
    // } else {
    //     return new Err<SignInSuccessDTO>("Error registering user");
    // }
}

private boolean validatePasswordComplexity(String newPw) {
    return newPw != null && newPw.length() >= 8;
}

public Flux<Comment> commentsGet(int snippetId) {
    return userStore.commentsGet(snippetId);
}

public Mono<SignInSuccess> userAuthenticate(SignIn dto, MultiValueMap<String, HttpCookie> cookies) {
    val mbUserCreds = userStore.userAuthentGet(dto.userName).get();
    if (mbUserCreds instanceof Success<AuthenticateIntern> userAuthents && userAuthents.vals.Count == 1) {
        val userAuthent = userAuthents.vals[0];
        userAuthent.hash = EncodingUtils.convertToBcrypt(userAuthent.hash);
        userAuthent.salt = EncodingUtils.convertToBcrypt(userAuthent.salt);

        boolean authentic = PasswordChecker.checkPassword(userAuthent, dto.password);
        if (!authentic) {
            cookies.Delete("accessToken");
            return errResponse;
        }

        String accessToken = "";
        if (userAuthent.expiration.Date != LocalDateTime.now().day()) {
            accessToken = makeAccessToken();
            userStore.userUpdateExpiration(userAuthent.userId, accessToken, LocalDateTime.Today);
        } else {
            accessToken = userAuthent.accessToken;
        }

        cookies.Append("accessToken", accessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });
        return new Success<SignInSuccessDTO>(new List<SignInSuccessDTO>() {
                new SignInSuccessDTO() { userId = userAuthent.userId, }
            }
        );
    } else {
        return errResponse;
    }
}

public Mono<ReqResult<SignInSuccess>> userAuthenticateAdmin(SignInAdmin dto, MultiValueMap<String, HttpCookie> cookies) {
    if (dto.userName != AdminPasswordChecker.adminName) return err;
    val mbUserCreds = userStore.userAuthentGet(dto.userName).block();

    if (mbUserCreds instanceof Success<AuthenticateIntern> userAuthents && userAuthents.vals.Count == 1) {
        val userAuthent = userAuthents.vals[0];
        userAuthent.hash = EncodingUtils.convertToBcrypt(userAuthent.hash);
        userAuthent.salt = EncodingUtils.convertToBcrypt(userAuthent.salt);

        boolean authentic = AdminPasswordChecker.checkAdminPassword(userAuthent, dto);
        if (!authentic) return err;

        String accessToken = "";
        if (userAuthent.expiration.Date != LocalDateTime.now()) {
            accessToken = makeAccessToken();
            userStore.userUpdateExpiration(userAuthent.userId, accessToken, LocalDateTime.Today).block();
        } else {
            accessToken = userAuthent.accessToken;
        }
        cookies.Append("accessToken", accessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });
        return new Success<SignInSuccess>(new List<SignInSuccess>() {
                new SignInSuccess() { userId = userAuthent.userId, }
            }
        );
    } else {
        return errResponse;
    }
}

public Mono<Boolean> userAuthorize(int userId, String accessToken) {
    val mbUserAuthor = userStore.userAuthorizGet(userId);
    if (mbUserAuthor instanceof Success<AuthorizeIntern> userAuthors && userAuthors.vals.Count == 1) {
        val userAuthor = userAuthors.vals[0];
        boolean authorized = userAuthor.expiration.Date == DateTime.Today && userAuthor.accessToken == accessToken;
        return authorized;
    } else {
        return false;
    }
}

public Mono<Boolean> userAuthorizeAdmin(String accessToken) {
    val mbUserAuthor = userStore.userAdminAuthoriz();
    return mbUserAuthor.map(x -> (x != null)
                ? userAuthor.expiration.Date == LocalDateTime.Today && userAuthor.accessToken == accessToken
                : false;
        );
}

public Mono<ReqResult<SignInSuccess>> userUpdateAdminPw(ChangePwAdmin dto, MultiValueMap<String, HttpCookie> cookies) {
    val authentResult = userAuthenticateAdmin(dto.signIn, cookies).block;

    if (authentResult instanceof Success<SignInSuccess> success) {
        val response = success.vals[0];
        String newSalt = "";
        val newHashSalt = AdminPasswordChecker.makeHash(dto.newPw);
        val newAccessToken = makeAccessToken();
        val user = new UserNewIntern() {
            userName = dto.signIn.userName, salt = newSalt,
            hash = newHash, accessToken = newAccessToken, dtExpiration = DateOnly.FromDateTime(DateTime.Now),
        };
        val updateCount = userStore.userUpdate(user).block();

        cookies.Append("accessToken", newAccessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });
        return HttpUtils.wrapSuccess(new SignInSuccessDTO() { userId = response.userId });
    } else {
        return errResponse;
    }
}

public Mono<Either<String, SignInSuccess>> userUpdatePw(ChangePw dto, MultiValueMap<String, HttpCookie> cookies) {
    val authentResult = userAuthenticate(dto.signIn, cookies);

    if (authentResult is Success<SignInSuccess> success) {
        val response = success.vals[0];
        String newSalt = "";
        val newHash = PasswordChecker.makeHash(dto.newPw, out newSalt);
        val newAccessToken = makeAccessToken();
        val user = new UserNewIntern() {
            userName = dto.signIn.userName, salt = newSalt,
            hash = newHash, accessToken = newAccessToken, dtExpiration = DateOnly.FromDateTime(DateTime.Now),
        };
        val updateCount = userStore.userUpdate(user);

        cookies.Append("accessToken", newAccessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });
        return HttpUtils.wrapSuccess(new SignInSuccessDTO() { userId = response.userId });
    } else {
        return errResponse;
    }
}

public Mono<Profile> userProfile(int userId) {
    val profileIncomplete = userStore.userProfile(userId);
    val userData = userStore.userData(userId);

    // return profileIncomplete.zipWith(userData, () -> {
    // });

    if (profileIncomplete is Success<Profile> prof && userData is Success<User> usr) {
        prof.vals[0].tsJoined = usr.vals[0].tsJoined;
    }
    return profileIncomplete;
}

private String makeAccessToken() {
    val uuid1 = UUID.randomUUID().toString();
    val uuid2 = UUID.randomUUID().toString();
    return (uuid1 + uuid2);
}


}
