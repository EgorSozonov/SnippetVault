package tech.sozonov.SnippetVault.cmn.filters;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import org.springframework.web.util.pattern.PathPattern;
import org.springframework.web.util.pattern.PathPatternParser;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.user.UserService;

@Component
public class AuthorizeAdminFilter implements WebFilter {


private UserService userService;
private final PathPattern pathPattern;

@Autowired
public AuthorizeAdminFilter(UserService _userService) {
    pathPattern = new PathPatternParser().parse("/api/admin/**");
    userService = _userService;
}

@Override
public Mono<Void> filter(ServerWebExchange webExchange, WebFilterChain filterChain) {
    if (webExchange.getRequest().getMethod().equals(HttpMethod.OPTIONS)) return filterChain.filter(webExchange);
    val requestPath = webExchange.getRequest().getPath().pathWithinApplication();

    if (!pathPattern.matches(requestPath)) return filterChain.filter(webExchange);

    val accessToken = webExchange.getRequest().getCookies().getFirst("accessToken");
    try {
        return userService.userAuthorizeAdmin(accessToken.getValue()).flatMap(authorized -> {
            if (authorized) return filterChain.filter(webExchange);
            val response = webExchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        });
    } catch (Exception e) {
        val response = webExchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return response.setComplete();
    }

}


}
