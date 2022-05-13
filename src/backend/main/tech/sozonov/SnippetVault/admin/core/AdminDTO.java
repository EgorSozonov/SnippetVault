
package tech.sozonov.SnippetVault.admin.core;


public class AdminDTO {

public static class Task {
    public int id;
    public String name;
    public String taskGroupName;
    public String description;
}

public static class TaskGroup {
    public int id;
    public String name;
    public String code;
}

public static class Language {
    public int id;
    public String name;
    public String code;
    public int sortingOrder;
}

public static class TaskCU extends CreateUpdate {
    public SelectChoice taskGroup;
    public String name;
    public String description;
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
