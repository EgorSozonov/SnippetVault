package tech.sozonov.SnippetVault;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertTrue;
import tech.sozonov.SnippetVault.cmn.utils.Deserializer;

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
    WHERE l."isDeleted" = 0::bit;
""";
    String[] queryColumns = Deserializer.parseColumnNames(input);
    assertTrue(queryColumns.length == 4);
    assertTrue(queryColumns[0].equals("id"));
    assertTrue(queryColumns[1].equals("name"));
    assertTrue(queryColumns[2].equals("sortingorder"));
    assertTrue(queryColumns[3].equals("code"));
}


}
