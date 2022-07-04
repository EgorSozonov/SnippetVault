package src.tech.sozonov.SnippetVault.user.auth;

public final class AdminPasswordChecker {


public static final String adminName = "adminosaurus";

public static boolean checkAdminName(String userName) {
    return userName.equals(adminName);
}


}
