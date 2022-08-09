package tech.sozonov.SnippetVault.user;
import java.time.LocalDateTime;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.cmn.internal.InternalTypes.*;
import tech.sozonov.SnippetVault.user.UserDTO.*;

public interface IUserStore {


Mono<AuthenticateIntern> userAuthentGet(String userName);

Mono<AuthorizeIntern> userAuthorizGet(String userName);
Mono<AuthorizeIntern> userAdminAuthoriz();
Mono<Integer> userHandshake(Handshake hshake, byte[] b);
Mono<HandshakeIntern> userHandshakeGet(String userName);

Mono<Integer> userRegister(UserNewIntern user);
Mono<Integer> userSignIn(UserSignInIntern user);
Mono<Integer> userUpdatePw(UserUpdatePwIntern user);
Mono<Integer> userVote(String userName, int tlId, int snId);
Mono<Profile> userProfile(String userName);
Mono<User> userData(String userName);
Mono<Integer> commentCU(CommentCU dto, String userName, LocalDateTime ts);
Flux<Comment> commentsGet(int snippetId);
Mono<Long> userCount();
Mono<Integer> initPopulate(String sqlScript);


}
