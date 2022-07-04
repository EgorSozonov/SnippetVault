package src.tech.sozonov.SnippetVault.cmn.utils;
import lombok.val;
import reactor.core.publisher.Mono;
import sozonov.SnippetVault.cmn.utils.Types.CreateUpdate;

import java.util.function.BiFunction;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.DatabaseClient.GenericExecuteSpec;

public class DB {


public static <T extends CreateUpdate> Mono<Integer> createOrUpdate(String sqlCreate, String sqlUpdate,
                                                                    BiFunction<GenericExecuteSpec, T, GenericExecuteSpec> paramsAdder, T dto, DatabaseClient db) {
    if (dto.existingId < 0) {
        val stmt = paramsAdder.apply(db.sql(sqlCreate), dto);
        return stmt.fetch().rowsUpdated();
    } else {
        val stmt = paramsAdder.apply(db.sql(sqlUpdate), dto)
                              .bind("isDeleted", dto.isDeleted)
                              .bind("existingId", dto.existingId);
        return stmt.fetch().rowsUpdated();
    }
}
    // if (dto.existingId >= 0) {
    //     return db.sql(taskGroupUpdateQ)
    //              .bind("existingId", dto.existingId)
    //              .bind("name", dto.name)
    //              .bind("code", dto.code)
    //              .bind("isDeleted", dto.isDeleted)
    //              .fetch()
    //              .rowsUpdated();
    // } else {
    //     return db.sql(taskGroupCreateQ)
    //              .bind("name", dto.name)
    //              .bind("code", dto.code)
    //              .bind("isDeleted", dto.isDeleted)
    //              .fetch()
    //              .rowsUpdated();
    // }

}
