package sozonov.SnippetVault.cmn.config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import io.r2dbc.spi.ConnectionFactory;
import io.r2dbc.postgresql.PostgresqlConnectionConfiguration;
import io.r2dbc.postgresql.PostgresqlConnectionFactory;
import org.springframework.data.r2dbc.config.AbstractR2dbcConfiguration;

@Configuration
public class DBConfiguration extends AbstractR2dbcConfiguration {


@Autowired
private Environment env;
@Bean
public ConnectionFactory connectionFactory() {
    return new PostgresqlConnectionFactory(
            PostgresqlConnectionConfiguration.builder()
                    .host(env.getProperty("db.host"))
                    .database(env.getProperty("db.dbname"))
                    .schema(env.getProperty("db.schema"))
                    .username(env.getProperty("db.username"))
                    .password(env.getProperty("db.password"))
                    .port(Integer.parseInt(env.getProperty("db.port")))
                    .build()
    );
}



}
