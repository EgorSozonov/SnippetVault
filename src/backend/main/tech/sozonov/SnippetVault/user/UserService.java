package tech.sozonov.SnippetVault.user;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;

import lombok.val;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;
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
import org.springframework.util.MultiValueMap;
import com.nimbusds.srp6.BigIntegerUtils;
import com.nimbusds.srp6.SRP6Routines;
import org.springframework.http.HttpCookie;
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
    BigInteger saltNum = new BigInteger(1, salt);

    BigInteger b = srp.generatePrivateValue(Constants.N, secureRandom);
    BigInteger B = srp.computePublicServerValue(Constants.N, Constants.g, Constants.k, verifierNum, b);

    System.out.println("v handshake = " + verifierNum.toString());
    System.out.println("b handshake = " + b.toString());
    System.out.println("B handshake = " + B.toString());
    System.out.println("salt handshake = " + saltNum.toString());


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
        System.out.println("=== handshake ===");
        BigInteger verifierNum = new BigInteger(1, user.verifier);
        BigInteger B = srp.computePublicServerValue(Constants.N, Constants.g, Constants.k, verifierNum, b);
        System.out.println("b = " + LocalDateTime.now() + " " + b.toString());
        System.out.println("verifier = " + verifierNum.toString());
        System.out.println("=== /handshake ===");

        return userStore.userHandshake(dto, bArr)
                        .map(rowsUpdated -> {
            if (rowsUpdated < 1) return Either.left("Handshake error");

            HandshakeResponse handshakeResponse = new HandshakeResponse(enc.encodeToString(user.salt), enc.encodeToString(B.toByteArray()));
            return Either.right(handshakeResponse);
        });
    });
}

/**
 * Validate A, M1
 * If correct, update the session key and date of expiration
 */
public Mono<Either<String, SignInResponse>> userSignIn(SignIn dto, MultiValueMap<String, HttpCookie> cookies) {
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

        System.out.println("A from client, decoded");
        System.out.println(ADecoded);
        System.out.println("M1 from client, decoded");
        System.out.println(M1Decoded);


        BigInteger b = new BigInteger(user.b);
        BigInteger B = srp.computePublicServerValue(Constants.N, Constants.g, Constants.k, verifier, b);
        System.out.println("=== sign-in ===");
        System.out.println("verifier = " + verifier.toString());
        System.out.println("b = " + LocalDateTime.now() + " " + b.toString());
        System.out.println("B = " + B.toString());
        System.out.println("=== /sign-in ===");


        String AConcatB = prependZeroToHex(ADecoded.toString(16)) + prependZeroToHex(B.toString(16));

        hasher.reset();
        hasher.update(AConcatB.getBytes());
        val uBytes = hasher.digest();

        BigInteger u = BigIntegerUtils.bigIntegerFromBytes(uBytes);
        System.out.println("u server = " + u.toString());

        BigInteger S = srp.computeSessionKey(Constants.N, verifier, u, ADecoded, b);
        System.out.println("S server = " + S.toString());
        val vu = verifier.modPow(u, Constants.N);
        val Avu = vu.multiply(ADecoded);
        System.out.println("Avu = " + Avu.toString());

        BigInteger serverM1 = computeM1(hasher, ADecoded, B, S); //srp.computeClientEvidence(hasher, ADecoded, B, S);

        System.out.println("Server M1");
        System.out.println(serverM1.toString());
        System.out.println("M1 from client");
        System.out.println(M1Decoded.toString());
        if (!serverM1.equals(M1Decoded)) {
            return Mono.just(Either.left("Authentication error"));
        }
        String inpM2 = ADecoded.toString(16) + serverM1.toString(16) + S.toString(16);
        hasher.update(inpM2.getBytes());
        BigInteger M2 = new BigInteger(hasher.digest());
        System.out.println("Server M2");
        System.out.println(M2);
        String M2B64 = Base64.getEncoder().encodeToString(M2.toByteArray());

        System.out.println("Session key = " + S.toString());

        UserSignInIntern updateUser = UserSignInIntern
            .builder()
            .userId(user.userId)
            .b(b.toByteArray())
            .accessToken(enc.encodeToString(S.toByteArray()))
            .dtExpiration(LocalDate.now())
            .build();

        return userStore.userUpdate(updateUser)
                        .map(x -> {
                            if (x < 1) return Either.left("DB update error");
                            return Either.right(new SignInResponse(M2B64, user.userId));
                        });
    });
}


private static BigInteger computeM1(MessageDigest hasher, BigInteger A, BigInteger B, BigInteger S) {
    String inp = prependZeroToHex(A.toString(16)) + prependZeroToHex(B.toString(16)) + prependZeroToHex(S.toString(16));
    hasher.reset();
    hasher.update(inp.getBytes());
    val result = hasher.digest();
    return new BigInteger(1, result);
}

private static String prependZeroToHex(String hex) {
    return hex.length() % 2 == 0 ? hex : "0" + hex;
}

private boolean validatePasswordComplexity(String newPw) {
    return newPw != null && newPw.length() >= 8;
}


//public Mono<Either<String, SignInSuccess>> userAuthenticate(SignIn dto, MultiValueMap<String, HttpCookie> cookies) {
    // TODO
    // return Mono.just(Either.left("TODO userRegister"));
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
//}

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
