package tech.sozonov.SnippetVault;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import tech.sozonov.SnippetVault.user.UserService;

@Component
public class Startup implements ApplicationRunner {
    private UserService userService;

    public Startup(UserService _userService) {
        userService = _userService;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        userService.addFirstUser();
    }
}
