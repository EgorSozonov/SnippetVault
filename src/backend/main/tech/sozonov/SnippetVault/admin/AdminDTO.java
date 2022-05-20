
package tech.sozonov.SnippetVault.admin;
import tech.sozonov.SnippetVault.cmn.utils.Types.CreateUpdate;
import tech.sozonov.SnippetVault.cmn.utils.Types.SelectChoice;

public class AdminDTO {


public static class TaskCU extends CreateUpdate {
    public String name;
    public String description;
    public SelectChoice taskGroup;

    public TaskCU(String _name, String _description, SelectChoice _taskGroup, int _existingId, boolean _isDeleted) {
        name = _name;
        description = _description;
        taskGroup = _taskGroup;
        existingId = _existingId;
        isDeleted = _isDeleted;
    }
}

public static class TaskGroupCU extends CreateUpdate {
    public String code;
    public String name;
}

public static class LanguageCU extends CreateUpdate {
    public String name;
    public String code;
    public int sortingOrder;
}

public static class PostResponse {
    public String status;
}

public static class Stats {
    public int primaryCount;
    public int alternativeCount;
    public int proposalCount;
    public long userCount;
}

public static class ProposalUpdate {
    public int existingId;
    public String content;
    public String libraries;
}


}
