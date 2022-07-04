package tech.sozonov.SnippetVault;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import tech.sozonov.SnippetVault.cmn.utils.Deserializer;

import static org.junit.jupiter.api.Assertions.assertTrue;
import java.util.List;

@DisplayName("Deserializer tests")
public class DeserializerTest {


@Test
@DisplayName("Given SQL input with a CTE clause and a comment line, the result should be correct")
void parser1() {
    String input = """
    WITH (SELECT a, b, c FROM foos) AS foo
    --SELECT l.bazaar, name, "sortingOrder", l.code
    SELECT l.id, name, "sortingOrder", l.code
    FROM sv.language l
    WHERE l."isDeleted" = false
""";
    List<String> queryColumns = Deserializer.parseColumnNames(input);
    assertTrue(queryColumns.size() == 4);
    assertTrue(queryColumns.get(0).equals("id"));
    assertTrue(queryColumns.get(1).equals("name"));
    assertTrue(queryColumns.get(2).equals("sortingorder"));
    assertTrue(queryColumns.get(3).equals("code"));
}

@Test
@DisplayName("Given SQL input with nested commas, the result should be correct")
void parser2() {
    String input = """
    SELECT
    	SUM(CASE WHEN s.status IN (1, 3) THEN 1 ELSE 0 END) AS "proposalCount",
    	SUM(CASE WHEN s.status = 3 THEN 1 ELSE 0 END) AS "approvedCount",
    	SUM(CASE WHEN s.status = 3 AND tl.id IS NOT NULL THEN 1 ELSE 0 END) AS "primaryCount",
        (SELECT "dateJoined" FROM sv.user WHERE id=:userId LIMIT 1) AS "tsJoined"
    FROM sv.snippet s
    LEFT JOIN sv."taskLanguage" tl ON tl."primarySnippetId" = s.id
    WHERE "authorId" = :userId
""";
    List<String> queryColumns = Deserializer.parseColumnNames(input);
    assertTrue(queryColumns.size() == 4);
    assertTrue(queryColumns.get(0).equals("proposalcount"));
    assertTrue(queryColumns.get(1).equals("approvedcount"));
    assertTrue(queryColumns.get(2).equals("primarycount"));
    assertTrue(queryColumns.get(3).equals("tsjoined"));
}


}
