package tech.sozonov.SnippetVault.admin;
import lombok.val;
import reactor.core.publisher.Flux;
import tech.sozonov.SnippetVault.admin.AdminDTO.*;
import tech.sozonov.SnippetVault.cmn.utils.Types.SelectChoice;

public class AdminService {


private final IAdminStore adminStore;

public AdminService(IAdminStore adminStore) {
    this.adminStore = adminStore;
}

public Flux<TaskCU> tasksAll() {
    val tasksIntern = adminStore.tasksAll();
    return tasksIntern.map(x -> new TaskCU(x.name, x.description, new SelectChoice(x.taskGroupId, x.taskGroupName), x.existingId, x.isDeleted));
}



public async Task<ReqResult<TaskGroupCUDTO>> taskGroupsAll() {
    return await st.taskGroupsAll();
}

public async Task<ReqResult<LanguageCUDTO>> languagesAll() {
    return await st.languagesAll();
}

public async Task<int> taskGroupCU(TaskGroupCUDTO dto) {
    if (string.IsNullOrEmpty(dto.name) || string.IsNullOrEmpty(dto.code)) return -1;
    return await st.taskGroupCU(dto);
}

public async Task<int> taskCU(TaskCUDTO dto) {
    if (string.IsNullOrEmpty(dto.name) || string.IsNullOrEmpty(dto.description)) return -1;
    return await st.taskCU(dto);
}

public async Task<int> languageCU(LanguageCUDTO dto) {
    if (string.IsNullOrEmpty(dto.name) || string.IsNullOrEmpty(dto.code)) return -1;
    return await st.languageCU(dto);
}

public async Task<ReqResult<StatsDTO>> statsForAdmin() {
    var result = await st.statsForAdmin();
    var userCount = await st.userCount();
    if (result is Success<StatsDTO> stats) {
        stats.vals[0].userCount = userCount;
    }
    return result;
}

}
