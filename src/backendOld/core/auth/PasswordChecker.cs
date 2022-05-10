namespace SnippetVault {
using BCrypt.Net;

internal static class PasswordChecker {
    private static readonly string pepper = "su3Y!mj9W";

    internal static bool checkPassword(AuthenticateIntern userCreds, string sentPw) {
        return BCrypt.Verify(sentPw + pepper, "$2a$11$" + userCreds.salt + userCreds.hash, true);
    }

    internal static string makeHash(string sentPw, out string salt) {
        var bCryptSalt = BCrypt.GenerateSalt();
        var saltAndHash = BCrypt.HashPassword(sentPw + pepper, bCryptSalt, true);
        salt = EncodingUtils.convertToBase64(bCryptSalt.Substring(7)); // Skipping the prefix $2a$10$
        var bCryptHash = saltAndHash.Substring(bCryptSalt.Length);
        var hash = EncodingUtils.convertToBase64(bCryptHash);


        return hash;
    }
}
    // 4Z!y18P+Zy1
}
