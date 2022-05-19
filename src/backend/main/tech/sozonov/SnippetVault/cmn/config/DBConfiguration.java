package tech.sozonov.SnippetVault.cmn.config;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.r2dbc.spi.ConnectionFactory;
import io.r2dbc.postgresql.PostgresqlConnectionFactory;
import org.springframework.data.r2dbc.config.AbstractR2dbcConfiguration;

@Configuration
public class DBConfiguration extends AbstractR2dbcConfiguration {


@Bean
public ConnectionFactory connectionFactory() {

    return new PostgresqlConnectionFactory(
            PostgresqlConnectionConfiguration.builder()
                    .host("localhost")
                    .database("test")
                    .username("user")
                    .password("password")
                    .build()
    );
}

@Bean
DatabaseClient databaseClient(ConnectionFactory connectionFactory) {
    return DatabaseClient.builder()
        .connectionFactory(connectionFactory)
        //.bindMarkers(() -> BindMarkersFactory.named(":", "", 20).create())
        .namedParameters(true)
        .build();
}


}
