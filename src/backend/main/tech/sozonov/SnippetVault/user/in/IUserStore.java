package tech.sozonov.SnippetVault.user.in;
import java.time.LocalDateTime;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.cmn.core.internal.InternalTypes.*;
import tech.sozonov.SnippetVault.user.core.UserDTO.*;

public interface IUserStore {


Mono<AuthenticateIntern> userAuthentGet(String userName);
Mono<AuthorizeIntern> userAuthorizGet(int userId);
Mono<AuthorizeIntern> userAdminAuthoriz();
Mono<Integer> userUpdateExpiration(int userId, String newToken, LocalDateTime newDate);
Mono<Integer> userRegister(UserNewIntern user);
Mono<Integer> userUpdate(UserNewIntern user);
Mono<Integer> userVote(int userId, int tlId, int snId);
Mono<Profile> userProfile(int userId);
Mono<User> userData(int userId);
Mono<Integer> commentCreate(int userId, int snId, String content, LocalDateTime ts);


}
