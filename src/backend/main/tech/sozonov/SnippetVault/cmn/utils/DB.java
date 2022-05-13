package tech.sozonov.SnippetVault.cmn.core.utils;

public class DB {

private Mono<Result> createOrUpdate<? extends CreateUpdate>(String sqlCreate, String sqlUpdate, BiFunction<Statement, T> paramsAdder, T dto) {
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

private static void taskParamAdder(Statement cmd, TaskCU dto) {
    return cmd.bind("name", dto.name)
              .bind("description", dto.description)
              .bind("tgId", dto.taskGroup.id);
}

private static void taskGroupParamAdder(Statement cmd, TaskGroupCU dto) {
    return cmd.bind("name", dto.name)
              .bind("code", dto.code)
              .bind("isDeleted", dto.isDeleted);
}

private static void languageParamAdder(Statement cmd, LanguageCU dto) {
    return cmd.bind("name", dto.name)
              .bind("code", dto.code)
              .bind("sortingOrder", dto.sortingOrder)
              .bind("isDeleted", dto.isDeleted);
}

}
