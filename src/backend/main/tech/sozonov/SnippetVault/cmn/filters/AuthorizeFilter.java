package tech.sozonov.SnippetVault.cmn.filters;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import org.springframework.web.util.pattern.PathPattern;
import org.springframework.web.util.pattern.PathPatternParser;
import lombok.val;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.user.UserService;

@Component
public class AuthorizeFilter implements WebFilter {


private UserService userService;
private final PathPattern pathPattern;

public AuthorizeFilter() {
    pathPattern = new PathPatternParser().parse("/api/secure/**");
}

@Override
public Mono<Void> filter(ServerWebExchange webExchange, WebFilterChain filterChain) {
    boolean authorized = true;
    val requestPath = webExchange.getRequest().getPath().pathWithinApplication();
    if (pathPattern.matches(requestPath)) {
        val userIdStr = webExchange.getRequest().getHeaders().getFirst("userId");
        val accessToken = webExchange.getRequest().getCookies().getFirst("accessToken");
        try {
            int userId = Integer.parseInt(userIdStr);
            System.out.println("Filter userId = " + userId);
            authorized = userService.userAuthorize(userId, accessToken.getValue()).block();
        } catch (Exception e) {
            authorized = false;
        }
    }

    if (authorized) {
        return filterChain.filter(webExchange);
    } else {
        val response = webExchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return response.setComplete();
    }
}


}
