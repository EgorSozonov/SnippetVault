package tech.sozonov.SnippetVault.core.filters;
import org.springframework.web.reactive.function.server.HandlerFilterFunction;
import org.springframework.web.reactive.function.server.HandlerFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import static org.springframework.web.reactive.function.server.RequestPredicates.*;

import org.springframework.http.HttpStatusCode;

import reactor.core.publisher.Mono;


public class AuthorizeFilter implements HandlerFilterFunction<ServerResponse, ServerResponse> {

@Override
public Mono<ServerResponse> filter(ServerRequest serverRequest, HandlerFunction<ServerResponse> handlerFunction) {
    String userId = serverRequest.headers().firstHeader("userId");

    return (userId != null && userId.equals("123"))
            ? handlerFunction.handle(serverRequest)
            : ServerResponse.status(401).build();
}

}
