package src.tech.sozonov.SnippetVault.cmn.utils;

import java.math.BigInteger;
import java.security.MessageDigest;

import lombok.val;

public class SecureRemotePassword {


public static BigInteger computeM1(MessageDigest hasher, BigInteger A, BigInteger B, BigInteger S) {
    String inp = prependZeroToHex(A.toString(16)) + prependZeroToHex(B.toString(16)) + prependZeroToHex(S.toString(16));
    hasher.reset();
    hasher.update(inp.getBytes());
    val result = hasher.digest();
    return new BigInteger(1, result);
}

public static String prependZeroToHex(String hex) {
    return hex.length() % 2 == 0 ? hex : "0" + hex;
}
}
