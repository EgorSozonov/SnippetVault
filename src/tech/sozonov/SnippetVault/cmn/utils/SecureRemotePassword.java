package tech.sozonov.SnippetVault.cmn.utils;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;
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

public static byte[] generateRandomSalt(MessageDigest hasher) {
    val random = new SecureRandom();
    byte seed[] = random.generateSeed(16);
    String inp = (LocalDateTime.now().toString()) + ":" + "serverSalt" + ":" + hexOfArray(seed);
    hasher.reset();
    hasher.update(inp.getBytes());
    return hasher.digest();
}

public static byte[] generateVerifier(byte[] salt, String identity, String password, MessageDigest hasher) {
    val x = generateX(hexOfArray(salt), identity, password, hasher);

    val verifierNum = Constants.g.modPow(x, Constants.N);
    return verifierNum.toByteArray();
}

private static BigInteger generateX(String saltHex, String identity, String pw, MessageDigest hasher) {
    hasher.reset();
    hasher.update((identity + ":" + pw).getBytes(StandardCharsets.UTF_8));
    String hash1 = hexOfArray(hasher.digest());
    System.out.println("hash1 " + hash1);
    String concat = (saltHex + hash1).toUpperCase();
    hasher.reset();

    hasher.update(concat.getBytes());
    val concatBytes = hasher.digest();
    System.out.println("hashHex " + hexOfArray(concatBytes));
    val hashNum = new BigInteger(1, concatBytes);
    return hashNum.remainder(Constants.N);
}


private static String hexOfArray(byte[] inp) {
    return HexFormat.of().formatHex(inp);
}

/*
public async generateRandomSalt(optionalServerSalt?: string): Promise<string> {
    const serverSalt = optionalServerSalt ?? "serverSalt"
    const s = this.randomHex(32);
    const inp = (new Date()) + ":" + serverSalt + ":" + s
    const resultBuffer: ArrayBuffer = await this.hash(inp)
    return nonprefixedHexOfArray(new Uint8Array(resultBuffer))
}
public async generateVerifier(saltHex: string, identity: string, password: string): Promise<BI> {
    const x = await this.generateX(saltHex, identity, password)
    this.verifier = modPow(this.g, x, this.N)
    return this.verifier
}
export function nonprefixedHexOfPositiveBI(inp: BI): string {
        let str = inp.toString(16)
        return (str.length % 2 === 0) ? str : (str.startsWith("0") ? str.substring(1) : ("0" + str))
}


export function prefixedHexOfBuff(inp: ArrayBuffer): string {
    return "0x" + (Array.from(new Uint8Array(inp)))
                .map((b) => HEX_DIGITS[b >> 4] + HEX_DIGITS[b & 15])
                .join("");
}

export function hexOfBuff(inp: ArrayBuffer): string {
    return hexOfArray(new Uint8Array(inp))
}

function padZeroPrefix(inp: string): string {
    return inp.length === 1 ? "0" + inp : inp
}

export function hexOfArray(inp: Uint8Array): string {
    let result = ""
    for (let i = 0; i < inp.length; ++i) {
        result = result + padZeroPrefix(inp[i].toString(16))
    }
    return result
}
 */

}