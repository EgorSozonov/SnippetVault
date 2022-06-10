
import BI from "jsbi"
import { SHA256 } from "crypto-js"
import { HEX_DIGITS } from "./Constants"
import { arrayOfBase64, base64OfArray, bigintOfBase64, hexOfArray as nonprefixedHexOfArray, hexOfBase64, nonprefixedHexOfPositiveBI, prefixedHexOfArray } from "./StringUtils"
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
 * Returns a randomly-generated salt in Base-64 format.
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

//Original verifier = 13554379927498243673524519972601432856476658191157275102779636041562240401186963506899857920489844711620813773053513648407270292513826886266400379619773431302560658488970455479072743211517549434379379736455682832040482191659233401172904296498122564637923703855583548472640062392506434941448663637941540196692549573582049187854538376051155966217981040826906790413799771492628297709669986177189521359588208291589470778759934908395613975307632163126162467507496915737302518472399057777723787995345583526762341895612497593753391583631760873796899329602156375555131998272849580446789596105273682726210597314614983497819528


/**
 * Generate data for sign-in using the handshake response
 */
public async step1(identity: string, password: string, saltB64: string, serverBB64: string): Promise<ValResult<DataForSignIn>> {
    this.I = identity
    this.P = password

    // B64 -> Hex -> BI
    const B = bigintOfBase64(serverBB64)

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

    this.S = this.computeSessionKey(this.k, x, u, a, this.B)
    console.log("client-side S = " + this.S.toString())
    const sStr = this.S.toString(16)
    this.K = this.hexOfBuff(await this.hash(sStr))

    this.M1 = this.hexOfBuff(await this.hash(this.A + B.toString() + sStr))
    console.log("client-side M1 = " + BI.BigInt(this.M1).toString())
    return {isOk: true, value: {AB64: this.A, M1B64: this.M1, }}
}

/**
 * Second step of the login process
 * (client-side validation of M2 received from server)
 */
public async step2(serverM2B64: string): Promise<ValResult<string>> {
    const SString = nonprefixedHexOfPositiveBI(this.S)
    const clientM2 = this.hexOfBuff(await this.hash(this.A + this.M1 + SString))
    const serverM2 = hexOfBase64(serverM2B64)
    console.log("client M2")
    console.log(clientM2)

    if (serverM2 !== clientM2) return {isOk: false, errMsg: "Bad server credentials (M2)"}

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
        const oneTimeBi = BI.BigInt(this.hexOfBuff(await this.hash(this.I + ":" + this.salt + ":" + (new Date()).getTime())))
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
private async computeU(A: string, B: string): Promise<BI | undefined> {
    const output = this.hexOfBuff(await this.hash(A + B))
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



private hexOfBuff(inp: ArrayBuffer): string {
    return "0x" + (Array.from(new Uint8Array(inp)))
                .map((b) => HEX_DIGITS[b >> 4] + HEX_DIGITS[b & 15])
                .join("");
}


// var hash = CryptoJS.SHA256("Message");
// ​
// hash.toString(CryptoJS.enc.Base64)
// > "L3dmip37+NWEi57rSnFFypTG7ZI25Kdz9tyvpRMrL5E=";
// ​
// hash.toString(CryptoJS.enc.Hex)
// > "2f77668a9dfbf8d5848b9eeb4a7145ca94c6ed9236e4a773f6dcafa5132b2f91";

private async generateX(saltHex: string, identity: string, pw: string): Promise<BI> {
    const hash1 = this.hexOfBuff(await this.hash(identity + ":" + pw))

    const concat = (saltHex + hash1).toUpperCase()
    const hashHex = this.hexOfBuff(await this.hash(concat))

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
