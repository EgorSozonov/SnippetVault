package tech.sozonov.SnippetVault.portsOut;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.core.DTO.AuxDTO.Language;
import tech.sozonov.SnippetVault.core.DTO.AuxDTO.Task;
import tech.sozonov.SnippetVault.core.DTO.AuxDTO.TaskGroup;


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
