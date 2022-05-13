package tech.sozonov.SnippetVault.admin;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.val;
import org.springframework.web.bind.annotation.RequestBody;
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

@GetMapping("taskGroupsForLanguage/{langId}")
public Mono<List<TaskGroup>> taskGroupsForLanguage(@PathVariable("langId") int langId) {
    var result = adminService.taskGroupsForLangGet(langId);
    await sendQueryResult<TaskGroupDTO>(result, HttpContext.Response);
}


@GetMapping("taskGroupsForLanguages/{langId1}/{langId2}")
public Mono<List<TaskGroup>> taskGroupsForLanguages(@PathVariable("langId1") int langId1, @PathVariable("langId2") int langId2) {
    var result = adminService.taskGroupsForLangsGet(langId1, langId2);
    await sendQueryResult<TaskGroupDTO>(result, HttpContext.Response);
}
}
