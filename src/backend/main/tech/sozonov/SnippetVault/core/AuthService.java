package tech.sozonov.SnippetVault.core;
import tech.sozonov.SnippetVault.core.DTO.AuthDTO.*;
import tech.sozonov.SnippetVault.core.internal.InternalTypes.UserNewIntern;
import tech.sozonov.SnippetVault.core.utils.Types.Err;
import tech.sozonov.SnippetVault.core.utils.Types.ReqResult;
import tech.sozonov.SnippetVault.core.auth.PasswordChecker;
import tech.sozonov.SnippetVault.core.auth.AdminPasswordChecker;
import tech.sozonov.SnippetVault.portsIn.IStore;
import lombok.val;
import reactor.core.publisher.Mono;


public class AuthService {

private final IStore st;

public AuthService(IStore _st) {
    this.st = _st;
}


public Mono<ReqResult<SignInSuccess>> userRegister(SignIn dto, IResponseCookies cookies) {
    if (dto.password == null || dto.password.length() < 8) {
        return new Err<SignInSuccess>("Error! Password length must be at least 8 symbols");
    }

    String newSalt = "";
    val newHashSalt = (dto.userName != AdminPasswordChecker.adminName)
        ? PasswordChecker.makeHash(dto.password) : AdminPasswordChecker.makeHash(dto.password);
    val newAccessToken = makeAccessToken();
    val user = UserNewIntern.builder()
        .userName(dto.userName).hash(newHash).salt(newSalt)
        .accessToken(newAccessToken)
        .dtExpiration(DateOnly.FromDateTime(DateTime.Today))
    .build();
    val newUserId = st.userRegister(user).get();
    if (newUserId > 0) {
        val successList =  List.of(new SignInSuccess(newUserId));
        // TODO Secure
        cookies.Append("accessToken", newAccessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });

        return new Success<SignInSuccessDTO>(successList);
    } else {
        return new Err<SignInSuccessDTO>("Error registering user");
    }
}

public Mono<ReqResult<SignInSuccess>> userAuthenticate(SignIn dto, IResponseCookies cookies) {
    var mbUserCreds = st.userAuthentGet(dto.userName).get();
    if (mbUserCreds instanceof Success<AuthenticateIntern> userAuthents && userAuthents.vals.Count == 1) {
        var userAuthent = userAuthents.vals[0];
        userAuthent.hash = EncodingUtils.convertToBcrypt(userAuthent.hash);
        userAuthent.salt = EncodingUtils.convertToBcrypt(userAuthent.salt);

        bool authentic = PasswordChecker.checkPassword(userAuthent, dto.password);
        if (!authentic) {
            cookies.Delete("accessToken");
            return new Err<SignInSuccessDTO>("Authentication error");
        }

        String accessToken = "";
        if (userAuthent.expiration.Date != DateTime.Today) {
            accessToken = makeAccessToken();
            await st.userUpdateExpiration(userAuthent.userId, accessToken, DateTime.Today);
        } else {
            accessToken = userAuthent.accessToken;
        }

        cookies.Append("accessToken", accessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });
        return new Success<SignInSuccessDTO>(new List<SignInSuccessDTO>() {
                new SignInSuccessDTO() { userId = userAuthent.userId, }
            }
        );
    } else {
        return new Err<SignInSuccessDTO>("Authentication error");
    }
}

public Mono<ReqResult<SignInSuccessDTO>> userAuthenticateAdmin(SignInAdminDTO dto, IResponseCookies cookies) {
    var err = new Err<SignInSuccessDTO>("Authentication error");
    if (dto.userName != AdminPasswordChecker.adminName) return err;
    var mbUserCreds = st.userAuthentGet(dto.userName).block();

    if (mbUserCreds instanceof Success<AuthenticateIntern> userAuthents && userAuthents.vals.Count == 1) {
        var userAuthent = userAuthents.vals[0];
        userAuthent.hash = EncodingUtils.convertToBcrypt(userAuthent.hash);
        userAuthent.salt = EncodingUtils.convertToBcrypt(userAuthent.salt);

        bool authentic = AdminPasswordChecker.checkAdminPassword(userAuthent, dto);
        if (!authentic) return err;

        String accessToken = "";
        if (userAuthent.expiration.Date != DateTime.Today) {
            accessToken = makeAccessToken();
            st.userUpdateExpiration(userAuthent.userId, accessToken, DateTime.Today).block();
        } else {
            accessToken = userAuthent.accessToken;
        }
        cookies.Append("accessToken", accessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });
        return new Success<SignInSuccessDTO>(new List<SignInSuccessDTO>() {
                new SignInSuccessDTO() { userId = userAuthent.userId, }
            }
        );
    } else {
        return err;
    }
}

public Mono<Boolean> userAuthorize(int userId, String accessToken) {
    var mbUserAuthor = st.userAuthorizGet(userId).block();
    if (mbUserAuthor instanceof Success<AuthorizeIntern> userAuthors && userAuthors.vals.Count == 1) {
        var userAuthor = userAuthors.vals[0];
        bool authorized = userAuthor.expiration.Date == DateTime.Today && userAuthor.accessToken == accessToken;
        return authorized;
    } else {
        return false;
    }
}

public Mono<Boolean> userAuthorizeAdmin(String accessToken) {
    var mbUserAuthor = st.userAdminAuthoriz().block();
    if (mbUserAuthor instanceof Success<AuthorizeIntern> userAuthors && userAuthors.vals.Count == 1) {
        var userAuthor = userAuthors.vals[0];
        bool authorized = userAuthor.expiration.Date == DateTime.Today && userAuthor.accessToken == accessToken;
        return authorized;
    } else {
        return false;
    }
}

public Mono<ReqResult<SignInSuccess>> userUpdateAdminPw(ChangePwAdmin dto, IResponseCookies cookies) {
    var authentResult = userAuthenticateAdmin(dto.signIn, cookies).block;

    if (authentResult instanceof Success<SignInSuccessDTO> success) {
        var response = success.vals[0];
        String newSalt = "";
        var newHashSalt = AdminPasswordChecker.makeHash(dto.newPw);
        var newAccessToken = makeAccessToken();
        var user = new UserNewIntern() {
            userName = dto.signIn.userName, salt = newSalt,
            hash = newHash, accessToken = newAccessToken, dtExpiration = DateOnly.FromDateTime(DateTime.Now),
        };
        var updateCount = st.userUpdate(user).block();

        cookies.Append("accessToken", newAccessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });
        return HttpUtils.wrapSuccess(new SignInSuccessDTO() { userId = response.userId });
    } else {
        return new Err<SignInSuccessDTO>("Authentication error");
    }
}

public Mono<ReqResult<SignInSuccess>> userUpdatePw(ChangePw dto, IResponseCookies cookies) {
    var authentResult = await userAuthenticate(dto.signIn, cookies);

    if (authentResult is Success<SignInSuccessDTO> success) {
        var response = success.vals[0];
        String newSalt = "";
        var newHash = PasswordChecker.makeHash(dto.newPw, out newSalt);
        var newAccessToken = makeAccessToken();
        var user = new UserNewIntern() {
            userName = dto.signIn.userName, salt = newSalt,
            hash = newHash, accessToken = newAccessToken, dtExpiration = DateOnly.FromDateTime(DateTime.Now),
        };
        var updateCount = await st.userUpdate(user);

        cookies.Append("accessToken", newAccessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });
        return HttpUtils.wrapSuccess(new SignInSuccessDTO() { userId = response.userId });
    } else {
        return new Err<SignInSuccessDTO>("Authentication error");
    }
}

private String makeAccessToken() {
    var uuid1 = Guid.NewGuid().ToString();
    var uuid2 = Guid.NewGuid().ToString();
    return (uuid1 + uuid2);
}
}
