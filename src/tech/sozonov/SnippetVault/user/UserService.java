package tech.sozonov.SnippetVault.user;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.val;
import org.springframework.beans.factory.annotation.Value;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.cmn.internal.InternalTypes.UserNewIntern;
import tech.sozonov.SnippetVault.cmn.internal.InternalTypes.UserSignInIntern;
import tech.sozonov.SnippetVault.cmn.internal.InternalTypes.UserUpdatePwIntern;
import tech.sozonov.SnippetVault.cmn.utils.Constants;
import tech.sozonov.SnippetVault.cmn.utils.Either;
import tech.sozonov.SnippetVault.cmn.utils.SecureRemotePassword;
import tech.sozonov.SnippetVault.user.UserDTO.*;
import tech.sozonov.SnippetVault.user.auth.AdminPasswordChecker;
import reactor.core.publisher.Flux;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Base64;

import static tech.sozonov.SnippetVault.cmn.utils.Strings.*;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;
import com.nimbusds.srp6.BigIntegerUtils;
import com.nimbusds.srp6.SRP6Routines;
import org.springframework.http.HttpCookie;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class UserService {


private final IUserStore userStore;
private final SRP6Routines srp;
private final SecureRandom secureRandom;
private static final Mono<Either<String, HandshakeResponse>> errResponse = Mono.just(Either.left("Authentication error"));
@Value("${startingAdminPassword}")
private String adminPassword;

@Autowired
public UserService(IUserStore _userStore) {
    this.userStore = _userStore;
    this.srp = new SRP6Routines();
    this.secureRandom = new SecureRandom();
}

public Flux<Comment> commentsGet(int snippetId) {
    return userStore.commentsGet(snippetId);
}

public Mono<Either<String, HandshakeResponse>> register(Register dto) {
    if (nullOrEmp(dto.userName)) return errResponse;

    val dec = Base64.getDecoder();

    byte[] verifier = dec.decode(dto.verifierB64);
    byte[] salt = dec.decode(dto.saltB64);

    return createUser(salt, verifier, dto.userName);
}

private Mono<Either<String, HandshakeResponse>> createUser(byte[] salt, byte[] verifier, String userName) {
    val enc = Base64.getEncoder();
    BigInteger verifierNum = new BigInteger(1, verifier);

    BigInteger b = srp.generatePrivateValue(Constants.N, secureRandom);
    BigInteger B = srp.computePublicServerValue(Constants.N, Constants.g, Constants.k, verifierNum, b);

    byte[] bArr = b.toByteArray();
    val newUser = UserNewIntern.builder()
            .userName(userName)
            .verifier(verifier)
            .salt(salt)
            .b(bArr)
            .accessToken("f")
            .dtExpiration(makeExpirationDate())
            .build();
    return userStore.userRegister(newUser)
            .map(rowsUpdated -> {
                if (rowsUpdated < 1) return Either.left("Registration error");

                HandshakeResponse handshakeResponse = new HandshakeResponse(enc.encodeToString(salt), enc.encodeToString(B.toByteArray()));
                return Either.right(handshakeResponse);
            });
}

private Instant makeExpirationDate() {
    return LocalDateTime.now().plusHours(24).atZone(ZoneId.systemDefault()).toInstant();
}

private Instant getNow() {
    return LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant();
}

public Mono<Either<String, HandshakeResponse>> handshakeAdmin(Handshake dto) {
    if (!AdminPasswordChecker.checkAdminName(dto.userName)) return Mono.just(Either.left("Incorrect user name"));
    return handshake(dto);
}

public Mono<Either<String, HandshakeResponse>> handshake(Handshake dto) {
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
public Mono<Either<String, SignInResponse>> signIn(SignIn dto, ServerWebExchange webEx) {
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

        BigInteger b = new BigInteger(1, user.b);
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
        BigInteger M2 = new BigInteger(1, hasher.digest());

        String M2B64 = Base64.getEncoder().encodeToString(M2.toByteArray());
        UserSignInIntern signIn = UserSignInIntern
                                    .builder()
                                    .userId(user.userId)
                                    .b(b.toByteArray())
                                    .accessToken(accessToken)
                                    .dtExpiration(makeExpirationDate())
                                    .build();
        return userStore.userSignIn(signIn)
                        .map(x -> {
                            if (x < 1) return Either.left("DB update error");
                            webEx.getResponse().addCookie(makeApiCookie(dto.userName, accessToken));
                            return Either.right(new SignInResponse(M2B64));
                        });
    });
}

private ResponseCookie makeApiCookie(String userName, String accessToken) {
    boolean isAdmin = AdminPasswordChecker.checkAdminName(userName);
    String cookiePath = isAdmin ? "/sv/api/admin" : "/sv/api/secure";
    return ResponseCookie.from("accessToken", accessToken)
                         .httpOnly(true)
                         .sameSite("Strict")
                         .path(cookiePath)
                         .secure(true)
                         .build();
}

public Mono<Boolean> userAuthorize(String userName, String accessToken) {
    return userStore.userAuthorizGet(userName)
                    .map(x -> x != null
                              && x.expiration.isAfter(getNow())
                              && x.accessToken.equals(accessToken));
}

public Mono<Boolean> userAuthorizeAdmin(String accessToken) {
    return userStore.userAdminAuthoriz().map(userAuthor -> ((userAuthor != null)
                ? userAuthor.expiration.isAfter(getNow()) && userAuthor.accessToken.equals(accessToken)
                : false)
        );
}

public Mono<Integer> updatePw(Register dto, ServerWebExchange webEx) {
    val enc = Base64.getEncoder();
    val dec = Base64.getDecoder();
    byte[] verifier = dec.decode(dto.verifierB64);
    byte[] salt = dec.decode(dto.saltB64);
    BigInteger randomSessionKey = srp.generatePrivateValue(Constants.N, secureRandom);
    String sessionKey = enc.encodeToString(randomSessionKey.toByteArray());
    UserUpdatePwIntern updatePw = UserUpdatePwIntern.builder()
                        .userName(dto.userName)
                        .verifier(verifier)
                        .salt(salt)
                        .accessToken(sessionKey)
                        .dtExpiration(makeExpirationDate())
                        .build();

    return userStore.userAuthorizGet(dto.userName).flatMap(userData -> {
        long timeToExpiration = ChronoUnit.MINUTES.between(getNow(), userData.expiration);

        // We only allow changing the password no more than one minute after a fresh login
        if (timeToExpiration < 1439) return Mono.just(-1);
        return userStore.userUpdatePw(updatePw).map(rowsUpdated -> {
            if (rowsUpdated < 1) return -1;
            webEx.getResponse().addCookie(makeApiCookie(dto.userName, sessionKey));
            return rowsUpdated;
        });
    });
}

public Mono<Profile> userProfile(String userName) {
    val profileIncomplete = userStore.userProfile(userName);
    val userData = userStore.userData(userName);

    return profileIncomplete.zipWith(userData, (profile, usr) -> {
        profile.tsJoined = usr.tsJoined;
        return profile;
    });
}

public Mono<Integer> userVote(Vote dto, String userName) {
    return userStore.userVote(userName, dto.tlId, dto.snId);
}

public Mono<Integer> commentCU(CommentCU dto, String userName) {
    return userStore.commentCU(dto, userName, LocalDateTime.now());
}

private Mono<Either<String, HandshakeResponse>> createUserBackend(String userName, String pw) {
    MessageDigest hasher = null;

    try {
        hasher = MessageDigest.getInstance("SHA-256");
    } catch (Exception e) {
    }
    System.out.println("adding " + userName);
    byte[] salt = SecureRemotePassword.generateRandomSalt(hasher);
    System.out.println("salt " + salt.length);
    byte[] backendVerifier = SecureRemotePassword.generateVerifier(salt, userName, pw, hasher);
    System.out.println("verif " + backendVerifier.length);
    return createUser(salt, backendVerifier, userName);
}

/**
 * The first deployment method to add first two users and then populate the DB with default data.
 */
public void addFirstUser() {
    System.out.println("checking users");
    final String firstUserName = "JoeRogan";
    final String adminName = "adminosaurus";
    val resource = getClass().getClassLoader().getResourceAsStream("PopulateAfterUser1WasCreated.sql");
    val sqlScript = new BufferedReader(new InputStreamReader(resource))
                                    .lines().collect(Collectors.joining("\n"));
    val result = userStore.userCount().flatMap((Long cnt) -> {
        if (cnt > 0) return Mono.just(Optional.of("Skipping user creation"));

        return createUserBackend(firstUserName, "RoganJoe").flatMap(resultFirstUser -> {
            if (resultFirstUser.isLeft()) {
                System.out.println("Error adding first user: " + resultFirstUser.getLeft());
                return Mono.just(Optional.of(resultFirstUser.getLeft()));
            }

            return createUserBackend(adminName, adminPassword).flatMap(resultAdmin -> {
                if (resultAdmin.isLeft()) {
                    System.out.println("Error adding admin: " + resultAdmin.getLeft());
                    return Mono.just(Optional.of(resultAdmin.getLeft()));
                }
                return userStore.initPopulate(sqlScript).map(rowsUpdated -> {
                    if (rowsUpdated < 1) {
                        return Mono.just(Optional.of("Could not populate with init data"));
                    }
                    return Mono.just(Optional.empty());
                });
            });
        });
    });
    result.block();
}



}
