package tech.sozonov.SnippetVault.admin;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
public Mono<List<TaskGroup>> taskGroupsAll() {
    var result = await api.taskGroupsAll();
    await sendQueryResult<TaskGroupCUDTO>(result, HttpContext.Response);
}

@GetMapping("language/all")
public Mono<List<Language>> languagesAll() {
    val result = await api.languagesAll();
    await sendQueryResult<LanguageCUDTO>(result, HttpContext.Response);
}

@GetMapping("admin/stats")
public Mono<Stats> statsForAdmin() {
    val result = await api.statsForAdmin();
    await sendQueryResult<StatsDTO>(result, HttpContext.Response);
}


@RestController
public class TasksLanguagesController {

@GetMapping("task/{taskId}")
public Mono<Task> task(@PathVariable("taskId") int taskId) {
    var result = await api.taskGet(taskId);
    await sendQueryResult<TaskDTO>(result, HttpContext.Response);
}


@GetMapping("languages")
public Mono<List<Language>> languages() {
    var result = await api.languagesGet();
    await sendQueryResult<LanguageDTO>(result, HttpContext.Response);
}

@GetMapping("taskGroups")
public Mono<List<TaskGroup>> taskGroup() {
    var result = await api.taskGroupsGet();
    await sendQueryResult<TaskGroupDTO>(result, HttpContext.Response);
}

@GetMapping("taskGroupsForLanguage/{langId}")
public Mono<List<TaskGroup>> taskGroupsForLanguage(@PathVariable("langId") int langId) {
    var result = await api.taskGroupsForLangGet(langId);
    await sendQueryResult<TaskGroupDTO>(result, HttpContext.Response);
}


@GetMapping("taskGroupsForLanguages/{langId1}/{langId2}")
public Mono<List<TaskGroup>> taskGroupsForLanguages(@PathVariable("langId1") int langId1, @PathVariable("langId2") int langId2) {
    var result = await api.taskGroupsForLangsGet(langId1, langId2);
    await sendQueryResult<TaskGroupDTO>(result, HttpContext.Response);
}
}
