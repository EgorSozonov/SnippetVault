using System;
using System.Collections.Generic;
namespace SnippetVault {
using BCrypt.Net;

internal static class AdminPasswordChecker {
    internal static readonly string adminName = "adminosaurus";
    private static readonly string pepper = "6U8q.d73@!PkW";
    private static readonly Dictionary<DayOfWeek, string> days = new Dictionary<DayOfWeek, string>() {
        {DayOfWeek.Monday, "uno"},
        {DayOfWeek.Tuesday, "dos"},
        {DayOfWeek.Wednesday, "tres"},
        {DayOfWeek.Thursday, "cuatro"},
        {DayOfWeek.Friday, "cinco"},
        {DayOfWeek.Saturday, "seis"},
        {DayOfWeek.Sunday, "siete"},
    };

    internal static bool checkAdminPassword(AuthenticateIntern authData, SignInAdminDTO dto) {
        if (dto.userName != adminName) return false;

        var today = DateTime.Today;
        string dayWeek = days[today.DayOfWeek];
        bool isEven = today.Day % 2 == 0;
        string password = isEven ? dto.password2 : dto.password1;
        string nonPassword = isEven ? dto.password1 : dto.password2;

        if (!String.IsNullOrEmpty(nonPassword)) {
            return false;
        }
        if (password.Length < dayWeek.Length || !password.EndsWith(dayWeek)) {
            return false;
        }
        string realPassword = password.Substring(0, password.Length - dayWeek.Length);

        return BCrypt.Verify(realPassword + pepper, "$2a$11$" + authData.salt + authData.hash, true);
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

}