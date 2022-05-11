package tech.sozonov.SnippetVault.core.DTO;

import tech.sozonov.SnippetVault.core.utils.Types.SelectChoice;

public class AuxDTO {
public static class TaskDTO {
    public int id;
    public String name;
    public String taskGroupName;
    public String description;
}

public static class TaskGroupDTO {
    public int id;
    public String name;
    public String code;
}

public static class LanguageDTO {
    public int id;
    public String name;
    public String code;
    public int sortingOrder;
}

public static class TaskCUDTO extends CUDTO {
    public SelectChoice taskGroup;
    public String name;
    public String description;
}

public static class TaskGroupCUDTO extends CUDTO {
    public String code;
    public String name;
}

public static class LanguageCUDTO extends CUDTO {
    public String name;
    public String code;
    public int sortingOrder;
}

public static class CUDTO {
    public int existingId;
    public boolean isDeleted;
}

public static class PostResponseDTO {
    public String status;
}

}
