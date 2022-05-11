package tech.sozonov.SnippetVault.core.utils;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import lombok.val;


public class Encoding {
/** Converting from bcrypt's weirdo encoding to real Base64.
* Source alphabet: ./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
* Target alphabet: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
*/
public static String convertToBase64(String inp) {
    byte[] asciiArray = inp.getBytes(StandardCharsets.US_ASCII);
    int resultLength = asciiArray.length % 4 == 0 ? asciiArray.length : ((asciiArray.length/4 + 1)*4);
    val resultArray = new byte[resultLength];
    // . -> A [46 -> 65]
    // / -> B [47 -> 66]
    // A-X are transformed by simple +2 in ASCII
    // Y -> a [89 -> 97]
    // Z -> b [90 -> 98]
    // a-x are transformed by +2 again
    // y is -> 0 [121 -> 48]
    // z is -> 1 [122 -> 49]
    // 0-7 are simply +2
    // 8 -> + [56 -> 43]
    // 9 -> / [57 -> 47]

    for (int i = 0; i < asciiArray.length; ++i) {
        byte src = asciiArray[i];
        if (src >= 48 && (src <= 55) || (src >= 65 && (src <= 88)) || (src >= 97 && (src <= 120))) {
            resultArray[i] = (byte)(src + 2);
        } else if (src == 46 || src == 47) {
            resultArray[i] = (byte)(src + 19);
        } else if (src == 89 || src == 90) {
            resultArray[i] = (byte)(src + 8);
        } else if (src == 121 || src == 122) {
            resultArray[i] = (byte)(src - 73);
        } else if (src == 56) {
            resultArray[i] = 43;
        } else if (src == 57) {
            resultArray[i] = 47;
        }
    }
    // Padding with "="
    for (int i = asciiArray.length; i < resultLength; ++i) {
        resultArray[i] = 61;
    }
    return Arrays.toString(resultArray);
}

/**
 * Converting to bcrypt's weirdo encoding from real Base64.
 * Source alphabet: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
 * Target alphabet: ./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
 */
public static String convertToBcrypt(String inp) {
    byte[] asciiArray = inp.getBytes(StandardCharsets.US_ASCII);
    int j = asciiArray.length - 1;
    while (j > 0 && asciiArray[j] == 61) --j;
    int resultLength = j + 1;
    val resultArray = new byte[resultLength];
    // . -> A [46 <- 65]
    // / -> B [47 <- 66]
    // C-Z are transformed by simple -2 in ASCII
    // Y -> a [89 <- 97]
    // Z -> b [90 <- 98]
    // c-z are transformed by -2 again
    // y is -> 0 [121 <- 48]
    // z is -> 1 [122 <- 49]
    // 2-9 are simply -2
    // 8 -> + [56 <- 43]
    // 9 -> / [57 <- 47]

    for (int i = 0; i < resultLength; ++i) {
        byte src = asciiArray[i];
        if (src >= 50 && (src <= 57) || (src >= 67 && (src <= 90)) || (src >= 99 && (src <= 122))) {
            resultArray[i] = (byte)(src - 2);
        } else if (src == 65 || src == 66) {
            resultArray[i] = (byte)(src - 19);
        } else if (src == 97 || src == 98) {
            resultArray[i] = (byte)(src - 8);
        }  else if (src == 48 || src == 49) {
            resultArray[i] = (byte)(src + 73);
        } else if (src == 43) {
            resultArray[i] = 56;
        } else if (src == 47) {
            resultArray[i] = 57;
        }
    }
    return Arrays.toString(resultArray);
}
}
