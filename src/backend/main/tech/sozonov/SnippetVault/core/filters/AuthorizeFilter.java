package tech.sozonov.SnippetVault.core.filters;
import org.springframework.web.reactive.function.server.HandlerFilterFunction;
import org.springframework.web.reactive.function.server.HandlerFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import lombok.val;
import static org.springframework.web.reactive.function.server.RequestPredicates.*;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.core.AuthService;


public class AuthorizeFilter implements HandlerFilterFunction<ServerResponse, ServerResponse> {

private AuthService authService;

@Autowired
public AuthorizeFilter(AuthService _authService) {
    authService = _authService;
}

@Override
public Mono<ServerResponse> filter(ServerRequest serverRequest, HandlerFunction<ServerResponse> handlerFunction) {
    String userIdStr = serverRequest.headers().firstHeader("userId");
    val accessToken = serverRequest.cookies().getFirst("accessToken");
    try {
        int userId = Integer.parseInt(userIdStr);
        boolean isAuthorized = authService.userAuthorize(userId, accessToken.getValue()).block();
        if (!isAuthorized) return ServerResponse.status(401).build();
    } catch (Exception e) {
        return ServerResponse.status(401).build();
    }
    return handlerFunction.handle(serverRequest);
}

}
