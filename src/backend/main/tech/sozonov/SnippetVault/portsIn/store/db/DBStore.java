package tech.sozonov.SnippetVault.portsIn.store.db;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.core.DTO.SnippetDTO.Snippet;
import tech.sozonov.SnippetVault.core.utils.Types.ReqResult;
import tech.sozonov.SnippetVault.portsIn.IStore;

public class DBStore implements IStore {


private static final String snippetsQ = """
    SELECT sn1.id as "leftId", sn1.content as "leftCode", tl1.id AS "leftTlId", sn1.libraries as "leftLibraries",
           t.id AS "taskId", t.name AS "taskName",
	       sn2.id AS "rightId", sn2.content AS "rightCode", tl2.id AS "rightTlId", sn2.libraries as "rightLibraries"
	FROM sv."task" AS t
	LEFT JOIN sv."taskLanguage" tl1 ON tl1."taskId"=t.id AND tl1."languageId"=@l1
	LEFT JOIN sv."taskLanguage" tl2 ON tl2."taskId"=t.id AND tl2."languageId"=@l2
	LEFT JOIN sv.language l1 ON l1.id=tl1."languageId"
	LEFT JOIN sv.language l2 ON l2.id=tl2."languageId"
	LEFT JOIN sv.snippet sn1 ON sn1.id=tl1."primarySnippetId"
	LEFT JOIN sv.snippet sn2 ON sn2.id=tl2."primarySnippetId"
	WHERE t."taskGroupId"=@tgId AND t."isDeleted"=0::bit;
""";
public Mono<ReqResult<Snippet>> snippetsGet(int taskGroup, int lang1, int lang2) {
    client.execute("INSERT INTO place(id,city) VALUES(:id, :city)")
    .bind("id", "nextval('place_id_seq')")
    .bind("city", place.getCity())
    .fetch().rowsUpdated()
    .then(client.execute("INSERT INTO place_category VALUES (:place_id, :category_id);")
      .bind("place_id", 5)
      .bind("category_id", place.getCategoryId())
      .fetch().rowsUpdated())
    .then();


    // await using (var cmd = new NpgsqlCommand(snippetsQ, db.conn)) {
    //     cmd.Parameters.AddWithValue("l1", NpgsqlTypes.NpgsqlDbType.Integer, lang1);
    //     cmd.Parameters.AddWithValue("l2", NpgsqlTypes.NpgsqlDbType.Integer, lang2);
    //     cmd.Parameters.AddWithValue("tgId", NpgsqlTypes.NpgsqlDbType.Integer, taskGroup);
    //     await using (var reader = await cmd.ExecuteReaderAsync()) {
    //         return readResultSet<SnippetDTO>(reader);
    //     }
    // }
}

}
