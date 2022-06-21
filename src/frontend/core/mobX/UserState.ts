import { action, computed, IObservableArray, makeAutoObservable, observable, runInAction } from "mobx"
import { toast } from "react-toastify"
import IClient from "../../ports/IClient"
import { ChangePwDTO, HandshakeResponseDTO, RegisterDTO } from "../types/dto/AuthDTO"
import { CommentDTO, ProfileDTO } from "../types/dto/UserDTO"
import ServerResponse from "../types/ServerResponse"
import { UserAccount } from "../types/UserAccount"
import { rfc5054 } from "../utils/Constants"
import { dateOfTS, isSameDay } from "../utils/DateUtils"
import SecureRemotePassword from "../utils/SecureRemotePassword"
import { base64OfBigInt, base64OfHex, nonprefixedHexOfPositiveBI } from "../utils/StringUtils"
import { processHandshake, processSignIn } from "../utils/User"
import { fetchFromClient } from "./Utils"


export default class UserState {

public acc: UserAccount | null = null
public profile: ProfileDTO | null = null
public comments: IObservableArray<CommentDTO> = observable.array([])
client: IClient

constructor(client: IClient) {
    this.client = client
    makeAutoObservable(this)
}

isUser = computed(() => {
    return (this.acc !== null && this.acc.status === "user")
})

isAdmin = computed(() => {
    return (this.acc !== null && this.acc.status === "admin")
})

userRegister = action(async (userName: string, password: string) => {
    const clientSRP = new SecureRemotePassword(rfc5054.N_base16, rfc5054.g_base10, rfc5054.k_base16)
    try {
        const saltHex = await clientSRP.generateRandomSalt()
        const verifier = await clientSRP.generateVerifier(saltHex, userName, password)
        const verifierHex = nonprefixedHexOfPositiveBI(verifier)

        // base64
        const handshakeResponse = processHandshake(await this.client.userRegister({
                                            saltB64: base64OfHex(saltHex),
                                            verifierB64: base64OfHex(verifierHex),
                                            userName
                                        }),
                                        "user")

        this.userFinishSignIn(handshakeResponse, userName, password, clientSRP)
    } catch (e) {
        console.log(e)
    }
})

userSignIn = action(async (userName: string, password: string) => {
    const handshakeResponse = processHandshake(await this.client.userHandshake({ userName }), "user")
    const clientSRP = new SecureRemotePassword(rfc5054.N_base16, rfc5054.g_base10, rfc5054.k_base16)
    runInAction(() => this.userFinishSignIn(handshakeResponse, userName, password, clientSRP))
})

userFinishSignIn = action(async (handshakeResponse: ServerResponse<HandshakeResponseDTO>, userName: string, password: string, clientSRP: SecureRemotePassword) => {
    if (handshakeResponse.isOK === false) {
        console.log("Handshake error " + handshakeResponse.errMsg)
        return
    }

    const mbAM1 = await clientSRP.step1(userName, password, handshakeResponse.value.saltB64, handshakeResponse.value.BB64)
    if (mbAM1.isOk === false) {
        console.log(mbAM1.errMsg)
        return
    }

    const {AB64, M1B64} = mbAM1.value

    const M2Response = processSignIn(await this.client.userSignIn({AB64, M1B64, userName}), "user")
    if (M2Response.isOK === false) return

    const resultSessionKey = await clientSRP.step2(M2Response.value.M2B64)
    if (resultSessionKey.isOk === false) return

    const sessionKey = base64OfBigInt(resultSessionKey.value)
    console.log("Session Key = " + sessionKey)

    runInAction(() => this.applySuccessfulSignIn("user", userName))
})


async generateDataForRegister(userName: string, password: string): Promise<RegisterDTO> {
    const clientSRP = new SecureRemotePassword(rfc5054.N_base16, rfc5054.g_base10, rfc5054.k_base16)


    const saltHex = await clientSRP.generateRandomSalt()
    const verifier = await clientSRP.generateVerifier(saltHex, userName, password)
    const verifierHex = nonprefixedHexOfPositiveBI(verifier)

    const result: RegisterDTO = {userName, saltB64: saltHex, verifierB64: verifierHex, }
    return result
}


changePw = action(async (newPw: string) => {
    if (this.acc === null) return
    const handshakeResponse = processHandshake(await this.client.userHandshake({ userName: this.acc?.userName }), "user")
    const clientSRP = new SecureRemotePassword(rfc5054.N_base16, rfc5054.g_base10, rfc5054.k_base16)

    if (handshakeResponse.isOK === false) {
        toast.error("Handshake error " + handshakeResponse.errMsg, { autoClose: 4000 })
        return
    }

    const mbAM1 = await clientSRP.step1(this.acc.userName, newPw, handshakeResponse.value.saltB64, handshakeResponse.value.BB64)
    if (mbAM1.isOk === false) {
        toast.error(mbAM1.errMsg, { autoClose: 4000 })
        return
    }

    const {AB64, M1B64} = mbAM1.value

    const saltHex = await clientSRP.generateRandomSalt()
    const verifier = await clientSRP.generateVerifier(saltHex, this.acc.userName, newPw)
    const verifierHex = nonprefixedHexOfPositiveBI(verifier)
    const dto: ChangePwDTO = {AB64, M1B64, register: { userName: this.acc.userName, saltB64: base64OfHex(saltHex), verifierB64: base64OfHex(verifierHex), } }

    const M2Response = processSignIn(await this.client.userChangePw(dto, this.acc.userName), "user")

    if (M2Response.isOK === false) {
        toast.error("Sign in error", { autoClose: 4000 })
        return
    }

    const resultSessionKey = await clientSRP.step2(M2Response.value.M2B64)
    if (resultSessionKey.isOk === false) {
        toast.error("Session key does not match the server, server may be compromised", { autoClose: 4000 })
        return
    }

    runInAction(() => this.applySuccessfulSignIn("user", this.acc!.userName))
})

applySuccessfulSignIn = action((status: "user" | "admin", userName: string) => {
    this.acc = { expiration: dateOfTS(new Date()), userName, status }
    localStorage.setItem("account", JSON.stringify(this.acc))

})

private accountsEq(a1: UserAccount | null, a2: UserAccount): boolean {
    if (a1 === null) return false
    return (a1.userName === a2.userName
            && a1.expiration.year === a2.expiration.year
            && a1.expiration.month === a2.expiration.month
            && a1.expiration.day === a2.expiration.day);
}

trySignInFromLS = action(() => {
    const fromLS = localStorage.getItem("account")
    if (!fromLS || fromLS.length < 1 || fromLS === "undefined") return;

    const accFromLS: UserAccount = JSON.parse(fromLS)

    if (accFromLS.userName && accFromLS.userName.length > 0
          && (accFromLS.status === "admin" || accFromLS.status === "user")
          && isSameDay(new Date(), accFromLS.expiration) === true
          && this.accountsEq(this.acc, accFromLS) === false) {
        this.acc = accFromLS
    }
})

signOut = action((): void => {
    this.acc = null
    this.profile = null
    localStorage.removeItem("account")
})

accountSet = action((newValue: UserAccount): void => {
    this.acc = newValue
})

profileGet = action(async () => {
    if (this.acc === null) return
    await fetchFromClient(this.client.userProfile(this.acc.userName), this.profileSet)
})

profileSet = action((newValue: ProfileDTO): void => {

    this.profile = newValue ?? null
})

userNameGet = action((): string | null => {
    return this.acc?.userName ?? null
})

commentsGet = action(async (snId: number) => {
    await fetchFromClient(this.client.commentsGet(snId), this.commentsSet)
})

commentsSet = action((newValue: CommentDTO[]): void => {
    if (!newValue) {
        this.comments = observable.array([])
        return
    }

    this.comments = observable.array(newValue.sort((x, y) => x.tsUpload < y.tsUpload ? 1 : -1))
})


}
