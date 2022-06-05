
import { BigInteger } from "jsbn"
import { SHA256 } from "crypto-js"

class SecureRemotePassword {

//readonly Nbase10: string

constructor(readonly NBase10: string, readonly gBase10: string, readonly kBase16: string) {
    //this.Nbase10 = _Nbase10
}

}

export default SecureRemotePassword
