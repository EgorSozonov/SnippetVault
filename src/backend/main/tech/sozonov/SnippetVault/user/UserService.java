package tech.sozonov.SnippetVault.user;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.val;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

import java.util.Base64;
import java.util.UUID;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.time.LocalDate;
import java.time.LocalDateTime;
import tech.sozonov.SnippetVault.user.UserDTO.*;
import tech.sozonov.SnippetVault.cmn.utils.Either;
import org.springframework.util.MultiValueMap;

import com.theicenet.cryptography.keyagreement.SRP6ServerService;
import com.theicenet.cryptography.keyagreement.pake.srp.v6a.SRP6ServerValuesB;

import org.springframework.http.HttpCookie;
import org.springframework.stereotype.Service;
import static tech.sozonov.SnippetVault.cmn.utils.Strings.*;

@Service
public class UserService {


private final IUserStore userStore;
private final SRP6ServerService srpService;
private static final Mono<Either<String, HandshakeResponse>> errResponse = Mono.just(Either.left("Authentication error"));

@Autowired
public UserService(IUserStore _userStore, SRP6ServerService _srpService) {
    this.userStore = _userStore;
    this.srpService = _srpService;
}


public Flux<Comment> commentsGet(int snippetId) {
    return userStore.commentsGet(snippetId);
}

public Mono<Either<String, HandshakeResponse>> userRegister(Register dto) {
    // TODO
    return errResponse;

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

public Mono<Either<String, HandshakeResponse>> userHandshake(Register dto, MultiValueMap<String, HttpCookie> cookies) {
    if (nullOrEmp(dto.userName)) return errResponse;
    BiFunction<Integer, byte[], Either<String, HandshakeResponse>> ll = (Integer updateResult, byte[] B) -> {
        if (updateResult < 1) {
            return Either.left("asdf");
        }
        HandshakeResponse result = new HandshakeResponse(dto.salt, Base64.getEncoder().encodeToString(B));
        Either<String, HandshakeResponse> res = Either.right(result);
        return res;
    };
    return userStore.userAuthentGet(dto.userName).flatMap(user -> {
        byte[] verifier = user.verifier;

        final SRP6ServerValuesB serverValuesB = srpService.computeValuesB(verifier);
        byte[] b = serverValuesB.getServerPrivateValueB();
        byte[] B = serverValuesB.getServerPublicValueB();
        HandshakeResponse result = new HandshakeResponse(dto.salt, Base64.getEncoder().encodeToString(B));
        Either<String, HandshakeResponse> errRes = Either.left("asdf");
        // return userStore.userUpdateTempKey(user.userId, b).flatMap(updateResult -> errResponse);

        Mono<Integer> ax = userStore.userUpdateTempKey(user.userId, b);
        Mono<Either<String, HandshakeResponse>> bx = ax.map(x -> ll.apply(x, B));
        return bx;
    });
    // get verifier & salt by username
    // generate b and save to the DB
    // send back B(b) and salt
}

private boolean validatePasswordComplexity(String newPw) {
    return newPw != null && newPw.length() >= 8;
}


public Mono<Either<String, SignInSuccess>> userAuthenticate(SignIn dto, MultiValueMap<String, HttpCookie> cookies) {
    // TODO
    return Mono.just(Either.left("TODO userRegister"));
    // val mbUserCreds = userStore.userAuthentGet(dto.userName).get();
    // if (mbUserCreds instanceof Success<AuthenticateIntern> userAuthents && userAuthents.vals.Count == 1) {
    //     val userAuthent = userAuthents.vals[0];
    //     userAuthent.hash = EncodingUtils.convertToBcrypt(userAuthent.hash);
    //     userAuthent.salt = EncodingUtils.convertToBcrypt(userAuthent.salt);

    //     boolean authentic = PasswordChecker.checkPassword(userAuthent, dto.password);
    //     if (!authentic) {
    //         cookies.Delete("accessToken");
    //         return errResponse;
    //     }

    //     String accessToken = "";
    //     if (userAuthent.expiration.Date != LocalDateTime.now().day()) {
    //         accessToken = makeAccessToken();
    //         userStore.userUpdateExpiration(userAuthent.userId, accessToken, LocalDateTime.Today);
    //     } else {
    //         accessToken = userAuthent.accessToken;
    //     }

    //     cookies.Append("accessToken", accessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });
    //     return new Success<SignInSuccessDTO>(new List<SignInSuccessDTO>() {
    //             new SignInSuccessDTO() { userId = userAuthent.userId, }
    //         }
    //     );
    // } else {
    //     return errResponse;
    // }
}

public Mono<Either<String, SignInSuccess>> userAuthenticateAdmin(SignInAdmin dto, MultiValueMap<String, HttpCookie> cookies) {
    // TODO
    return Mono.just(Either.left("TODO userAuthenticateAdmin"));
    // if (dto.userName != AdminPasswordChecker.adminName) return err;
    // val mbUserCreds = userStore.userAuthentGet(dto.userName).block();

    // if (mbUserCreds instanceof Success<AuthenticateIntern> userAuthents && userAuthents.vals.Count == 1) {
    //     val userAuthent = userAuthents.vals[0];
    //     userAuthent.hash = EncodingUtils.convertToBcrypt(userAuthent.hash);
    //     userAuthent.salt = EncodingUtils.convertToBcrypt(userAuthent.salt);

    //     boolean authentic = AdminPasswordChecker.checkAdminPassword(userAuthent, dto);
    //     if (!authentic) return err;

    //     String accessToken = "";
    //     if (userAuthent.expiration.Date != LocalDateTime.now()) {
    //         accessToken = makeAccessToken();
    //         userStore.userUpdateExpiration(userAuthent.userId, accessToken, LocalDateTime.Today).block();
    //     } else {
    //         accessToken = userAuthent.accessToken;
    //     }
    //     cookies.Append("accessToken", accessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });
    //     return new Success<SignInSuccess>(new List<SignInSuccess>() {
    //             new SignInSuccess() { userId = userAuthent.userId, }
    //         }
    //     );
    // } else {
    //     return errResponse;
    // }
}

public Mono<Boolean> userAuthorize(int userId, String accessToken) {
    return userStore.userAuthorizGet(userId)
                    .map(x -> x != null
                              && x.expiration.toLocalDate().isEqual(LocalDate.now())
                              && x.accessToken.equals(accessToken));
}

public Mono<Boolean> userAuthorizeAdmin(String accessToken) {
    return userStore.userAdminAuthoriz().map(userAuthor -> ((userAuthor != null)
                ? userAuthor.expiration.toLocalDate().isEqual(LocalDate.now()) && userAuthor.accessToken.equals(accessToken)
                : false)
        );
}

public Mono<Either<String, SignInSuccess>> userUpdateAdminPw(ChangePwAdmin dto, MultiValueMap<String, HttpCookie> cookies) {
    // TODO
    return Mono.just(Either.left("TODO userAuthenticateAdmin"));
    // val authentResult = userAuthenticateAdmin(dto.signIn, cookies).block;

    // if (authentResult instanceof Success<SignInSuccess> success) {
    //     val response = success.vals[0];
    //     String newSalt = "";
    //     val newHashSalt = AdminPasswordChecker.makeHash(dto.newPw);
    //     val newAccessToken = makeAccessToken();
    //     val user = new UserNewIntern() {
    //         userName = dto.signIn.userName, salt = newSalt,
    //         hash = newHash, accessToken = newAccessToken, dtExpiration = DateOnly.FromDateTime(DateTime.Now),
    //     };
    //     val updateCount = userStore.userUpdate(user).block();

    //     cookies.Append("accessToken", newAccessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });
    //     return HttpUtils.wrapSuccess(new SignInSuccessDTO() { userId = response.userId });
    // } else {
    //     return errResponse;
    // }
}

public Mono<Either<String, SignInSuccess>> userUpdatePw(ChangePw dto, MultiValueMap<String, HttpCookie> cookies) {
    // TODO
    return Mono.just(Either.left("TODO userAuthenticateAdmin"));
    // val authentResult = userAuthenticate(dto.signIn, cookies);

    // if (authentResult is Success<SignInSuccess> success) {
    //     val response = success.vals[0];
    //     String newSalt = "";
    //     val newHash = PasswordChecker.makeHash(dto.newPw, out newSalt);
    //     val newAccessToken = makeAccessToken();
    //     val user = new UserNewIntern() {
    //         userName = dto.signIn.userName, salt = newSalt,
    //         hash = newHash, accessToken = newAccessToken, dtExpiration = DateOnly.FromDateTime(DateTime.Now),
    //     };
    //     val updateCount = userStore.userUpdate(user);

    //     cookies.Append("accessToken", newAccessToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict, });
    //     return HttpUtils.wrapSuccess(new SignInSuccessDTO() { userId = response.userId });
    // } else {
    //     return errResponse;
    // }
}

public Mono<Profile> userProfile(int userId) {
    val profileIncomplete = userStore.userProfile(userId);
    val userData = userStore.userData(userId);

    return profileIncomplete.zipWith(userData, (profile, usr) -> {
        profile.tsJoined = usr.tsJoined;
        return profile;
    });
}

public Mono<Integer> userVote(Vote dto, int userId) {
    return userStore.userVote(userId, dto.tlId, dto.snId);
}

public Mono<Integer> commentCU(CommentCU dto, int userId) {
    return userStore.commentCU(dto, userId, LocalDateTime.now());
}

private String makeAccessToken() {
    val uuid1 = UUID.randomUUID().toString();
    val uuid2 = UUID.randomUUID().toString();
    return (uuid1 + uuid2);
}


}
