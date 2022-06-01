package tech.sozonov.SnippetVault.cmn.filters;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import org.springframework.web.util.pattern.PathPattern;
import org.springframework.web.util.pattern.PathPatternParser;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.user.UserService;

public class AuthorizeAdminFilter implements WebFilter {


private UserService userService;
private final PathPattern pathPattern;

@Autowired
public AuthorizeAdminFilter(UserService _userService) {
    pathPattern = new PathPatternParser().parse("/api/admin.**");
    userService = _userService;
}

@Override
public Mono<Void> filter(ServerWebExchange webExchange, WebFilterChain filterChain) {
    boolean authorized = true;
    val requestPath = webExchange.getRequest().getPath().pathWithinApplication();
    if (pathPattern.matches(requestPath)) {
        val accessToken = webExchange.getRequest().getCookies().getFirst("accessToken");
        try {
            authorized = userService.userAuthorizeAdmin(accessToken.getValue()).block();
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
