package tech.sozonov.SnippetVault;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;

@Configuration
public class WebConfig implements WebFluxConfigurer {

// @Override
// protected void configure(HttpSecurity http) throws Exception {
//     http.csrf().disable();
// }

@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
                //.allowedOrigins("http://sozonov.tech", "https://sozonov.tech", "http://www.sozonov.tech", "https://www.sozonov.tech")
                .allowedOrigins("null")
                .allowedMethods("GET", "POST", "OPTIONS", "PUT")
                .allowCredentials(true)
                .maxAge(3600);
}


}
