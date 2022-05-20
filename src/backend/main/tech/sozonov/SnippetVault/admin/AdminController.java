package tech.sozonov.SnippetVault.admin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.admin.AdminDTO.*;

@RestController
@RequestMapping("/api")
public class AdminController {


private final AdminService adminService;

@Autowired
public AdminController(AdminService _adminService) {
    adminService = _adminService;
}

@GetMapping("task/all")
public Flux<TaskCU> tasksAll() {
    return adminService.tasksAll();
}

@GetMapping("taskGroup/all")
public Flux<TaskGroupCU> taskGroupsAll() {
    return adminService.taskGroupsAll();
}

@GetMapping("language/all")
public Flux<LanguageCU> languagesAll() {
    return adminService.languagesAll();
}

@GetMapping("admin/stats")
public Mono<Stats> statsForAdmin() {
    return adminService.statsForAdmin();
}

}
