package tech.sozonov.SnippetVault.portsIn.store.db;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableTransactionManagement
public class DBConfiguration extends AbstractR2dbcConfiguration {


@Override
@Bean
public ConnectionFactory connectionFactory() {
    // postgres
    return new PostgresqlConnectionFactory(
            PostgresqlConnectionConfiguration.builder()
                    .host("localhost")
                    .database("test")
                    .username("user")
                    .password("password")
                    //.codecRegistrar(EnumCodec.builder().withEnum("post_status", Post.Status.class).build())
                    .build()
    );
}

@Override
protected List<Object> getCustomConverters() {
    return List.of(new PostReadingConverter(), new PostStatusWritingConverter());
}

@Bean
ReactiveTransactionManager transactionManager(ConnectionFactory connectionFactory) {
    return new R2dbcTransactionManager(connectionFactory);
}

@Bean
public ConnectionFactoryInitializer initializer(ConnectionFactory connectionFactory) {

    ConnectionFactoryInitializer initializer = new ConnectionFactoryInitializer();
    initializer.setConnectionFactory(connectionFactory);

    // CompositeDatabasePopulator populator = new CompositeDatabasePopulator();
    // populator.addPopulators(new ResourceDatabasePopulator(new ClassPathResource("schema.sql")));
    // populator.addPopulators(new ResourceDatabasePopulator(new ClassPathResource("data.sql")));
    // initializer.setDatabasePopulator(populator);

    return initializer;
}


}
