package tech.sozonov.SnippetVault;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

import lombok.val;
import tech.sozonov.SnippetVault.cmn.utils.Deserializer;


@SpringBootApplication
public class SnippetVaultApplication {



public static void main(String[] args) {
	SpringApplication.run(SnippetVaultApplication.class, args);

//     System.out.println("HW");
//     val languagesGetQ = """
//     WITH (SELECT a, b, c FROM foos) AS foo
//     --SELECT l.bazaar, name, "sortingOrder", l.code
//     SELECT l.id, name, "sortingOrder", l.code
//     FROM sv.language l
//     WHERE l."isDeleted" = 0::bit;
// """;

//     val res = Deserializer.parseSelectFrom(languagesGetQ);
//     System.out.println(res.fst);
}

@Bean
public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
	return args -> {
		System.out.println("Application was started!");
		// String[] beanNames = ctx.getBeanDefinitionNames();
		// Arrays.sort(beanNames);
		// for (String beanName : beanNames) {
		// 	System.out.println(beanName);
		// }
	};
}

}
