package tech.sozonov.SnippetVault.cmn.in;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.val;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.core.DTO.AuxDTO.TaskGroup;
import tech.sozonov.SnippetVault.core.DTO.SnippetDTO.Snippet;
import tech.sozonov.SnippetVault.core.utils.Types.ReqResult;
import tech.sozonov.SnippetVault.portsIn.IStore;

public class CmnStore {

public static Mono<Result> createOrUpdate<? extends CreateUpdate>(String sqlCreate, String sqlUpdate, BiFunction<Statement, T> paramsAdder, T dto) {
    if (dto.existingId < 0) {
        val st1 = Mono.from(c.createStatement(sqlCreate));
        val st2 = paramsAdder.apply(temp, dto);
        return st2.execute();
    } else {
        val st1 = Mono.from(c.createStatement(sqlUpdate));
        val st2 = paramsAdder.apply(temp, dto).bind("existingId", dto.existingId);
        return st2.execute();
    }
}

public static void taskParamAdder(Statement cmd, TaskCU dto) {
    return cmd.bind("name", dto.name)
              .bind("description", dto.description)
              .bind("tgId", dto.taskGroup.id);
}

public static void taskGroupParamAdder(Statement cmd, TaskGroupCU dto) {
    return cmd.bind("name", dto.name)
              .bind("code", dto.code)
              .bind("isDeleted", dto.isDeleted);
}

public static void languageParamAdder(Statement cmd, LanguageCU dto) {
    return cmd.bind("name", dto.name)
              .bind("code", dto.code)
              .bind("sortingOrder", dto.sortingOrder)
              .bind("isDeleted", dto.isDeleted);
}


}
