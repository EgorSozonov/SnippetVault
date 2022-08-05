package tech.sozonov.SnippetVault.cmn.utils;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
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

public static String generateRandomSalt(MessageDigest hasher) {
    String s = randomHex(32);
    String inp = (LocalDateTime.now().toString()) + ":" + "serverSalt" + ":" + s;
    hasher.reset();
    hasher.update(inp.getBytes());
    val hash = hasher.digest();
    return hexOfArray(hash);
}

private static String hexOfArray(byte[] inp) {
    return HexFormat.of().formatHex(inp);
}

private static String padZeroPrefix(String inp) {
    return inp.length() == 1 ? "0" + inp : inp;
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

private async generateX(saltHex: string, identity: string, pw: string): Promise<BI> {
    const hash1 = hexOfBuff(await this.hash(identity + ":" + pw))

    const concat = (saltHex + hash1).toUpperCase()
    const hashHex = prefixedHexOfBuff(await this.hash(concat))

    return BI.remainder(BI.BigInt(hashHex), this.N)
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