
import { BigInteger } from "jsbn"
import { SHA256 } from "crypto-js"

/**
 * Implementation of client-side SRP because thinbus-srp is unuseable/not Typescript.
 * Eventually I'll factor this out into a separate library.
 */
class SRPSession {


private state: SessionState = SessionState.init

/** Salted, hashed password */
private x = ""

/** Verifier */
public v = ""

/** User identity (login or email etc) */
public I = ""


constructor() {
    //this.Nbase10 = _Nbase10
}

private generateX(salt: string, identity: string, pw: string): string {
    let hash1 = this.hash(identity + ":" + pw)
    hash1 = this.trimLeadingZeros(hash1)

    const concat = (salt + hash1).toUpperCase()
    const hash = this.trimLeadingZeros(this.hash(concat))


    return this.fromHex(hash).mod(this.N())
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

private hash(x: string) {
    return SHA256(x).toString().toLowerCase();
}

private validate(v: string): ValResult {
    return {ok: true}
}

}


type ValResult = {ok: true} | {ok: false, errMsg: string}

const enum SessionState {
    init = 0,
    step1 = 1,
    step2 = 2,
    step3 = 3,
}

export default SRPSession
