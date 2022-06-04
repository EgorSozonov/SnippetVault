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

                // .allowedHeaders("Content-Type", "X-Requested-With", "accept", "Origin", "Access-Control-Request-Method",
                //                 "Access-Control-Request-Headers")
                // .exposedHeaders("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials")
                .allowCredentials(true)
                .maxAge(3600);
}


}
