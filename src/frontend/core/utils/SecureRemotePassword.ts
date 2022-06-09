
import BI from "jsbi"
import { SHA256 } from "crypto-js"
import { HEX_DIGITS } from "./Constants"
import { arrayOfBase64, base64OfArray } from "./StringUtils"

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
private S = ""

/** Server public key */
public B: BI

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
    this.B = BI.BigInt("0")
    //this.Nbase10 = _Nbase10
}

// public async run(userName: string, password: string) {
//     try {
//         const {salt, serverB} = await getResponse1(userName)
//         const {A, M1} = this.step1(userName, password, salt, serverB)
//         const M2 = await getResponse2(A, M1)
//         const result2 = this.step2(M2)

//     } catch (e) {
//     }
// }

/**
 * Returns a randomly-generated salt in Base-64 format.
 * The length of the salt is the same as the hashing algo H
 */
public async generateRandomSalt(optionalServerSalt?: string): Promise<string> {
    const serverSalt = optionalServerSalt ?? "serverSalt"
    const s = this.randomHex(32);
    console.log("random hex in generateRandomSalt")
    console.log(s)
    const inp = (new Date()) + ":" + serverSalt + ":" + s
    console.log("inp = " + inp)
    const resultBuffer: ArrayBuffer = await this.hash(inp)
    return base64OfArray(new Uint8Array(resultBuffer))
}

public async generateVerifier(salt: string, identity: string, password: string) {
    const x = await this.generateX(salt, identity, password)
    const v = this.g.modPow(x, this.N)
    return v.toString(16)
}


public async step1(identity: string, password: string, salt: string, serverB: string): Promise<ValResult<DataForSignIn>> {
    this.I = identity
    this.P = password

    console.log("serverB = " + serverB)
    const B = new BigInteger(this.hexOf(arrayOfBase64(serverB)))
    console.log("B from server raw = " + B)
    if (B.mod(this.N).equals(BigInteger.ZERO)) {
        return {isOk: false, errMsg: "Bad server public value B = 0"}
    }
    const x = await this.generateX(salt, this.I, this.P)
    // No reason to keep the password anymore
    this.P = ""

    // client B 62425524965426014912896352494250516563660080036344791459121550578918264705645052152173553723364610304233159311508573094255051762304324031469142426164963366341334050840566440880522531336562774151927135252329090660547737363393122908326012313007427338842458765747541040853320152823172060517343654963551268244950044449614112644701636646595254245251877305230933030415687355161353650825394137047945123351149471904844083562753334235223928073112340111591020064423912283200283471320946863390643431444085141825439375524081
    // server B 12400907751054855477594447713719660449555462953005703464917281768740134162839977201005187063586139921859847474730446201128338778099316627582810573893726711219923230434806926246232893076745899129701055505870412559331776347084462544110667810939710810933587276590069513062631979091175933818021005162136454743983649111138722449260270200656701322714375313268540446390378833724580632071978513845347473286653290129374560267359656217360139568227120738748105719241773219027243542024493619964298157381756434459372987430073287328473493594203063073634425985207461014488918276642537860694622538334488863975298385175656325337725563
    const a = await this.randomA()

    const ANum = this.g.modPow(a, this.N)
    this.A = ANum.toString(16)
    const u = await this.computeU(this.A, serverB)
    if (!u) return {isOk: false, errMsg: "Bad client value u"}

    this.S = this.computeSessionKey(this.k, x, u, a, this.B).toString(16)
    this.K = this.hexOfBuff(await this.hash(this.S))

    this.M1 = this.trimLeadingZeros(this.hexOfBuff(await this.hash(this.A + B + this.S)))

    return {isOk: true, value: {A: this.A, M1: this.M1, }}
}

/**
 * Second step of the login process
 * (client-side validation of M2 received from server)
 */
public async step2(serverM2: string): Promise<ValResult<string>> {
    const clientM2 = this.trimLeadingZeros(this.hexOfBuff(await this.hash(this.A + this.M1 + this.S)))
    console.log("client M2")
    console.log(clientM2)

    if (serverM2 !== clientM2) return {isOk: false, errMsg: "Bad server credentials (M2)"}

    return {isOk: true, value: this.S}
}

private async randomA(): Promise<BigInteger> {
    const hexLength = this.N.toString(16).length
    const ZERO = new BigInteger("0", 10)
    const ONE = new BigInteger("1", 10)
    let r = ZERO
    while (r.equals(ZERO)) {
        const rstr = this.randomHex(hexLength)
        const rBi = new BigInteger(rstr, 16)
        const oneTimeBi = new BigInteger(this.hexOfBuff(await this.hash(this.I + ":" + this.salt + ":" + (new Date()).getTime())), 16)
        r = oneTimeBi.add(rBi).modPow(ONE, this.N)
    }
    return r
}

// Server columns: salt (64 bytes), verifier (256 bytes), b (256 bytes)
/**
 * Compute the scrambler value. If it's zero, process is aborted
 */
private async computeU(A: string, B: string): Promise<BigInteger | undefined> {
    const output = this.hexOfBuff(await this.hash(A + B))
    const result = new BigInteger(output, 16)
    if (result.equals(BigInteger.ZERO)) {
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
	//return Math.random().toString(16).substring(0, l)
    return this.hexOf(result);
}

private hexOf(inp: Uint8Array): string {
    return Array.from(inp)
                .map((b) => HEX_DIGITS[b >> 4] + HEX_DIGITS[b & 15])
                .join("");
}

private hexOfBuff(inp: ArrayBuffer): string {
    return (Array.from(new Uint8Array(inp)))
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

private async generateX(salt: string, identity: string, pw: string): Promise<BigInteger> {
    const hash1 = this.trimLeadingZeros(this.hexOfBuff(await this.hash(identity + ":" + pw)))

    const concat = (salt + hash1).toUpperCase()
    const hash = this.trimLeadingZeros(this.hexOfBuff(await this.hash(concat)))

    return this.fromHex(hash).mod(this.N)
}

public computeSessionKey(k: BigInteger, x: BigInteger, u: BigInteger, a: BigInteger, B: BigInteger): BigInteger {
    const exp = u.multiply(x).add(a)
    const tmp = this.g.modPow(x, this.N).multiply(k)
    return B.subtract(tmp).modPow(exp, this.N)
}

private trimLeadingZeros(x: string): string {
    let result = x
    while (result.substring(0, 1) === '0') {
        result = result.substring(1)
    }
    return result
}

private fromHex(s: string): BigInteger {
    return new BigInteger(s, 16)
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

type DataForSignIn = {A: string, M1: string}

export default SecureRemotePassword
