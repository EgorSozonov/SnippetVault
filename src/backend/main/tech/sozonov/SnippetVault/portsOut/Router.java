package tech.sozonov.SnippetVault.portsOut;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;
import tech.sozonov.SnippetVault.core.DataService;
import tech.sozonov.SnippetVault.core.filters.AuthorizeFilter;
import static org.springframework.web.reactive.function.server.RequestPredicates.*;


@Configuration
public class Router {

@Bean
public RouterFunction<ServerResponse> route(DataService svc) {
    return RouterFunctions.route(
            GET("/hello").and(accept(MediaType.ALL)), svc::foo
        ).filter(new AuthorizeFilter())
        .andRoute(
            GET("/hello2").and(accept(MediaType.ALL)), svc::foo
        );
}

@Bean
public RouterFunction<ServerResponse> route2(DataService svc) {
    return RouterFunctions.route(GET("/hello2")
        .and(accept(MediaType.ALL)), svc::foo);
}

}
