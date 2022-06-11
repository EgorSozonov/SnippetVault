
import BI from "jsbi"
import { SHA256 } from "crypto-js"
import { HEX_DIGITS } from "./Constants"
import { arrayOfBase64, base64OfArray, base64OfHex, bigintOfBase64, hexOfArray as nonprefixedHexOfArray, hexOfBase64, hexOfBuff, nonprefixedHexOfPositiveBI, prefixedHexOfArray, prefixedHexOfBuff } from "./StringUtils"
import { modPow, ONE, ZERO } from "./ModularArithmetic"

/**
 * Implementation of client-side SRP because thinbus-srp is unuseable/not Typescript.
 * Eventually I'll factor this out into a separate library.
 */
class SecureRemotePassword {


/** Verifier */
public v = ""

/** User identity (login or email etc) */
public I = ""

/** Validation session key to compute K: S = ((A*(v^u % N)) ^ b) % N */
private S: BI = ZERO

/** Server public key */
public B: BI = ZERO

/** Password */
public P = ""

private K = ""

private A = ""

private M1 = ""

/** Salt computed here on the client */
public salt = ""

public readonly k: BI

public readonly g: BI

public readonly N: BI


constructor(NStr: string, gStr: string, kHexStr: string) {
    this.N = BI.BigInt(NStr)
    this.g = BI.BigInt(gStr)
    this.k = BI.BigInt(kHexStr)
}

/**
 * Returns a randomly-generated salt in non-prefixed hex format.
 * The length of the salt is the same as the hashing algo H
 */
public async generateRandomSalt(optionalServerSalt?: string): Promise<string> {
    const serverSalt = optionalServerSalt ?? "serverSalt"
    const s = this.randomHex(32);
    const inp = (new Date()) + ":" + serverSalt + ":" + s
    const resultBuffer: ArrayBuffer = await this.hash(inp)
    return nonprefixedHexOfArray(new Uint8Array(resultBuffer))
}

public async generateVerifier(saltHex: string, identity: string, password: string) {
    const x = await this.generateX(saltHex, identity, password)
    const verifier = modPow(this.g, x, this.N)
    console.log("Original verifier = " + verifier.toString())
    return nonprefixedHexOfPositiveBI(verifier)
}

/**
 * Generate data for sign-in using the handshake response
 */
public async step1(identity: string, password: string, saltB64: string, serverBB64: string): Promise<ValResult<DataForSignIn>> {
    this.I = identity
    this.P = password

    // B64 -> Hex -> BI
    const B = bigintOfBase64(serverBB64)
    console.log("B on client: " + B.toString())

    if (BI.equal(BI.remainder(B, this.N), ZERO)) {
        return {isOk: false, errMsg: "Bad server public value B = 0"}
    }
    const x = await this.generateX(hexOfBase64(saltB64), this.I, this.P)
    // No reason to keep the password around anymore
    this.P = ""

    const a = await this.randomA()

    const ANum = modPow(this.g, a, this.N)
    console.log("client-side A = " + ANum.toString())

    this.A = nonprefixedHexOfPositiveBI(ANum)
    const u = await this.computeU(this.A, hexOfBase64(serverBB64))

    if (!u) return {isOk: false, errMsg: "Bad client value u"}
    console.log("client u = " + u.toString())

    this.S = this.computeSessionKey(this.k, x, u, a, this.B)
    console.log("client-side S = " + this.S.toString())
    const sStr = this.S.toString(16)
    this.K = hexOfBuff(await this.hash(sStr))

    const M1Buff = await this.hash(this.A + B.toString() + sStr)
    this.M1 = hexOfBuff(M1Buff)
    console.log("client-side M1 = " + BI.BigInt(prefixedHexOfBuff(M1Buff)).toString())

    const AB64 = base64OfHex(this.A)
    const M1B64 = base64OfHex(this.M1)
    return {isOk: true, value: {AB64, M1B64, }}
}

/**
 * Second step of the login process
 * (client-side validation of M2 received from server)
 */
public async step2(serverM2B64: string): Promise<ValResult<string>> {
    const SString = nonprefixedHexOfPositiveBI(this.S)
    const M2Buff = await this.hash(this.A + this.M1 + SString)
    const clientM2Hex = hexOfBuff(M2Buff)
    const serverM2Hex = hexOfBase64(serverM2B64)
    console.log("client M2")
    console.log(BI.BigInt(M2Buff).toString())

    if (clientM2Hex !== serverM2Hex) return {isOk: false, errMsg: "Bad server credentials (M2)"}

    return {isOk: true, value: SString}
}


/**
 * Generation of the client private key, "a"
 */
private async randomA(): Promise<BI> {
    let r = ZERO
    while (BI.equal(r, ZERO)) {
        const rstr = this.randomHex(512)
        const rBi = BI.BigInt(rstr)
        const oneTimeBi = BI.BigInt(prefixedHexOfBuff(await this.hash(this.I + ":" + this.salt + ":" + (new Date()).getTime())))
        r = BI.remainder(BI.add(oneTimeBi, rBi), this.N)
    }
    return r
}

// final int minBits = Math.max(256, N.bitLength());

// BigInteger r = BigInteger.ZERO;

// while( BigInteger.ZERO.equals(r)){
// 	r = (new BigInteger(minBits, random)).mod(N);
// }

// return r;


// Server columns: salt (64 bytes), verifier (256 bytes), b (256 bytes)
/**
 * Compute the scrambler value. If it's zero, process is aborted
 */
private async computeU(AHex: string, BHex: string): Promise<BI | undefined> {
    console.log("AHex")
    console.log(AHex)
    console.log("BHex")
    console.log(BHex)
    const output = prefixedHexOfBuff(await this.hash(AHex + BHex))
    console.log("client input for hash for u = " + AHex + BHex)
    const result = BI.BigInt(output)
    if (BI.equal(result, ZERO)) {
        return undefined
    }
    return result
}

/**
 * Random string of hex digits with a set length
 */
private randomHex(l: number): string {
    const arr = new Uint8Array(l)
    const result = crypto.getRandomValues(arr)
    return prefixedHexOfArray(result);
}


private async generateX(saltHex: string, identity: string, pw: string): Promise<BI> {
    const hash1 = hexOfBuff(await this.hash(identity + ":" + pw))

    const concat = (saltHex + hash1).toUpperCase()
    const hashHex = prefixedHexOfBuff(await this.hash(concat))

    return BI.remainder(BI.BigInt(hashHex), this.N)
}

/**
 * Client's session key S = (B - kg^x)^(a + ux)
 */
public computeSessionKey(k: BI, x: BI, u: BI, a: BI, B: BI): BI {
    const exp = BI.add(BI.multiply(u, x), a)
    const kgx = BI.multiply(modPow(this.g, x, this.N), k)
    return modPow(BI.subtract(B, kgx), exp, this.N)
}

private async hash(x: string): Promise<ArrayBuffer> {
    //return SHA256(x).toString().toLowerCase();
    const dec = new TextDecoder()
    const encoded = new TextEncoder().encode(x)
    const resultArr = await crypto.subtle.digest('SHA-256', encoded)
    return resultArr;
}

private validate(v: string): ValResult<boolean> {
    return {isOk: true, value: true}
}

}


type ValResult<T> = {isOk: true, value: T} | {isOk: false, errMsg: string}

type DataForSignIn = {AB64: string, M1B64: string}

export default SecureRemotePassword
