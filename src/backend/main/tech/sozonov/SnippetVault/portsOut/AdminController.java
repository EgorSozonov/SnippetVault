package tech.sozonov.SnippetVault.portsOut;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.val;
import org.springframework.web.bind.annotation.RequestBody;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.core.DataService;
import tech.sozonov.SnippetVault.core.DTO.AuxDTO.Language;
import tech.sozonov.SnippetVault.core.DTO.AuxDTO.TaskCU;
import tech.sozonov.SnippetVault.core.DTO.AuxDTO.TaskGroup;
import tech.sozonov.SnippetVault.core.DTO.UserDTO.Stats;


@RestController
@RequestMapping("/api")
public class AdminController {

private final DataService api;

@Autowired
public AdminController(DataService _api) {
    api = _api;
}

@GetMapping("task/all")
public Mono<List<TaskCU>> tasksAll() {
    var result = await api.tasksAll();
    await sendQueryResult<TaskCU>(result, HttpContext.Response);
}


@PostMapping("task/cu")
[ServiceFilter(typeof(AuthorizeAdminFilter))]
public Mono<RequestEntity> taskCreateUpdate(@RequestBody TaskCU dto) {
    if (dto == null) return;
    await applyPostRequest(api.taskCU(dto), HttpContext.Response);
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


@PostMapping("language/cu")
[ServiceFilter(typeof(AuthorizeAdminFilter))]
public Mono<RequestEntity> languageCreateUpdate(@RequestBody LanguageCU dto) {
    if (dto == null) return;
    await applyPostRequest(api.languageCU(dto), HttpContext.Response);
}


@PostMapping("taskGroup/cu")
[ServiceFilter(typeof(AuthorizeAdminFilter))]
public Mono<List<TaskGroup>> taskGroupCreateUpdate(@RequestBody TaskGroupCU dto) {
    if (dto == null) return;
    await applyPostRequest(api.taskGroupCU(dto), HttpContext.Response);
}

@GetMapping("admin/stats")
public Mono<Stats> statsForAdmin() {
    val result = await api.statsForAdmin();
    await sendQueryResult<StatsDTO>(result, HttpContext.Response);
}
}
