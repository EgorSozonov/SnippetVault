package tech.sozonov.SnippetVault.cmn.utils;
import lombok.val;
import reactor.core.publisher.Mono;
import java.util.function.BiConsumer;

public class DB {


public static <T> Mono<Result> createOrUpdate<? extends CreateUpdate>(String sqlCreate, String sqlUpdate, BiConsumer<Statement, T> paramsAdder, T dto) {
    if (dto.existingId < 0) {
        val st1 = Mono.from(c.createStatement(sqlCreate));
        paramsAdder.apply(temp, dto);
        return st2.execute();
    } else {
        val st1 = Mono.from(c.createStatement(sqlUpdate));
        paramsAdder.apply(temp, dto)//.bind("existingId", dto.existingId);
        return st2.execute();
    }
}


}
