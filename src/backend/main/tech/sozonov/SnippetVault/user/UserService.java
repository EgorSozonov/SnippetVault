package tech.sozonov.SnippetVault.user;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.val;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import java.util.Base64;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import tech.sozonov.SnippetVault.user.UserDTO.*;
import tech.sozonov.SnippetVault.cmn.internal.InternalTypes.UserNewIntern;
import tech.sozonov.SnippetVault.cmn.internal.InternalTypes.UserSignInIntern;
import tech.sozonov.SnippetVault.cmn.utils.Constants;
import tech.sozonov.SnippetVault.cmn.utils.Either;
import tech.sozonov.SnippetVault.cmn.utils.SecureRemotePassword;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;
import com.nimbusds.srp6.BigIntegerUtils;
import com.nimbusds.srp6.SRP6Routines;
import org.springframework.http.HttpCookie;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import static tech.sozonov.SnippetVault.cmn.utils.Strings.*;

@Service
public class UserService {


private final IUserStore userStore;
private final SRP6Routines srp;
private final SecureRandom secureRandom;
private static final Mono<Either<String, HandshakeResponse>> errResponse = Mono.just(Either.left("Authentication error"));

@Autowired
public UserService(IUserStore _userStore) {
    this.userStore = _userStore;
    this.srp = new SRP6Routines();
    this.secureRandom = new SecureRandom();
}

public Flux<Comment> commentsGet(int snippetId) {
    return userStore.commentsGet(snippetId);
}

public Mono<Either<String, HandshakeResponse>> userRegister(Register dto) {
    if (nullOrEmp(dto.userName)) return errResponse;
    val enc = Base64.getEncoder();
    val dec = Base64.getDecoder();

    byte[] verifier = dec.decode(dto.verifierB64);
    byte[] salt = dec.decode(dto.saltB64);
    BigInteger verifierNum = new BigInteger(1, verifier);

    BigInteger b = srp.generatePrivateValue(Constants.N, secureRandom);
    BigInteger B = srp.computePublicServerValue(Constants.N, Constants.g, Constants.k, verifierNum, b);

    byte[] bArr = b.toByteArray();
    val newUser = UserNewIntern.builder()
                        .userName(dto.userName)
                        .verifier(verifier)
                        .salt(salt)
                        .b(bArr)
                        .accessToken("f")
                        .dtExpiration(LocalDate.now())
                        .build();
    return userStore.userRegister(newUser)
                    .map(rowsUpdated -> {
        if (rowsUpdated < 1) return Either.left("Registration error");

        HandshakeResponse handshakeResponse = new HandshakeResponse(enc.encodeToString(salt), enc.encodeToString(B.toByteArray()));
        return Either.right(handshakeResponse);
    });
}

public Mono<Either<String, HandshakeResponse>> userHandshake(Handshake dto, MultiValueMap<String, HttpCookie> cookies) {
    if (nullOrEmp(dto.userName)) return errResponse;
    val enc = Base64.getEncoder();

    BigInteger b = srp.generatePrivateValue(Constants.N, secureRandom);

    byte[] bArr = b.toByteArray();
    return userStore.userAuthentGet(dto.userName).flatMap(user -> {
        BigInteger verifierNum = new BigInteger(1, user.verifier);
        BigInteger B = srp.computePublicServerValue(Constants.N, Constants.g, Constants.k, verifierNum, b);

        return userStore.userHandshake(dto, bArr)
                        .map(rowsUpdated -> {
            if (rowsUpdated < 1) return Either.left("Handshake error");

            HandshakeResponse handshakeResponse = new HandshakeResponse(enc.encodeToString(user.salt), enc.encodeToString(B.toByteArray()));
            return Either.right(handshakeResponse);
        });
    });
}

/**
 * Validates A, M1 which were received from the client.
 * If correct, updates the session key and date of expiration in DB, and sets the cookie.
 */
public Mono<Either<String, SignInResponse>> userSignIn(SignIn dto, ServerWebExchange webEx) {
    if (nullOrEmp(dto.userName)) return Mono.just(Either.left("Sign in error"));

    return userStore.userAuthentGet(dto.userName).flatMap(user -> {
        BigInteger verifier = new BigInteger(1, user.verifier);
        val dec = Base64.getDecoder();
        val enc = Base64.getEncoder();
        MessageDigest hasher = null;
        try {
            hasher = MessageDigest.getInstance("SHA-256");
        } catch (Exception e) {
        }

        BigInteger ADecoded = new BigInteger(1, dec.decode(dto.AB64));
        BigInteger M1Decoded = new BigInteger(1, dec.decode(dto.M1B64));


        BigInteger b = new BigInteger(user.b);
        BigInteger B = srp.computePublicServerValue(Constants.N, Constants.g, Constants.k, verifier, b);

        String AConcatB = SecureRemotePassword.prependZeroToHex(ADecoded.toString(16)) + SecureRemotePassword.prependZeroToHex(B.toString(16));

        hasher.reset();
        hasher.update(AConcatB.getBytes());
        val uBytes = hasher.digest();

        BigInteger u = BigIntegerUtils.bigIntegerFromBytes(uBytes);

        BigInteger S = srp.computeSessionKey(Constants.N, verifier, u, ADecoded, b);

        BigInteger serverM1 = SecureRemotePassword.computeM1(hasher, ADecoded, B, S);

        if (!serverM1.equals(M1Decoded)) {
            return Mono.just(Either.left("Authentication error"));
        }
        String accessToken = enc.encodeToString(S.toByteArray());

        String inpM2 = ADecoded.toString(16) + serverM1.toString(16) + S.toString(16);
        hasher.update(inpM2.getBytes());
        BigInteger M2 = new BigInteger(hasher.digest());
        String M2B64 = Base64.getEncoder().encodeToString(M2.toByteArray());
        UserSignInIntern updateUser = UserSignInIntern
            .builder()
            .userId(user.userId)
            .b(b.toByteArray())
            .accessToken(accessToken)
            .dtExpiration(LocalDate.now())
            .build();

        return userStore.userUpdate(updateUser)
                        .map(x -> {
                            if (x < 1) return Either.left("DB update error");
                            val newCookie = ResponseCookie.from("accessToken", accessToken)
                                                          .httpOnly(true)
                                                          .sameSite("Strict")
                                                          .path("/sv/api/")
                                                          .secure(true)
                                                          .build();
                            webEx.getResponse().addCookie(newCookie);

                            return Either.right(new SignInResponse(M2B64, user.userId));
                        });
    });
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


}
