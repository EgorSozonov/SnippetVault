import { action, computed, IObservableArray, makeAutoObservable, observable, runInAction } from "mobx"
import { toast } from "react-toastify"
import IClient from "../../ports/IClient"
import { HandshakeResponseDTO } from "../types/dto/AuthDTO"
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
    const trySignIn = await this.registerWorker(userName, password)
    if (trySignIn === "") {
        runInAction(() => this.applySuccessfulSignIn("user", userName))
    } else {
        toast.error(trySignIn, { autoClose: 4000 })
    }
})

userSignIn = action(async (userName: string, password: string, mode: "user" | "admin") => {
    const trySignIn = await this.signInWorker(userName, password, mode)
    if (trySignIn === "") {
        runInAction(() => this.applySuccessfulSignIn(mode, userName))
    } else {
        toast.error(trySignIn, { autoClose: 4000 })
    }
})

private async registerWorker(userName: string, password: string): Promise<string> {
    const clientSRP = new SecureRemotePassword(rfc5054.N_base16, rfc5054.g_base10, rfc5054.k_base16)

    const saltHex = await clientSRP.generateRandomSalt()
    const verifier = await clientSRP.generateVerifier(saltHex, userName, password)
    const verifierHex = nonprefixedHexOfPositiveBI(verifier)
    const handshakeResponse = processHandshake(await this.client.userRegister({
                                        saltB64: base64OfHex(saltHex),
                                        verifierB64: base64OfHex(verifierHex),
                                        userName
                                    }))

    return this.signInWorkerFinish(userName, password, handshakeResponse, clientSRP)
}

private async signInWorker(userName: string, password: string, mode: "user" | "admin"): Promise<string> {
    const handshakeServerResponse = mode === "user" ? await this.client.userHandshake({ userName })
                                                : await this.client.userHandshakeAdmin({ userName })
    const handshakeResponse = processHandshake(handshakeServerResponse)
    const clientSRP = new SecureRemotePassword(rfc5054.N_base16, rfc5054.g_base10, rfc5054.k_base16)
    return this.signInWorkerFinish(userName, password, handshakeResponse, clientSRP)
}

private async signInWorkerFinish(userName: string, password: string, handshakeResponse: ServerResponse<HandshakeResponseDTO>, clientSRP: SecureRemotePassword): Promise<string> {
    if (handshakeResponse.isOK === false) return "Handshake error " + handshakeResponse.errMsg

    const mbAM1 = await clientSRP.step1(userName, password, handshakeResponse.value.saltB64, handshakeResponse.value.BB64)
    if (mbAM1.isOk === false) return mbAM1.errMsg

    const {AB64, M1B64} = mbAM1.value
    const M2Response = processSignIn(await this.client.userSignIn({AB64, M1B64, userName}))
    if (M2Response.isOK === false) return "Sign-in error"

    const resultSessionKey = await clientSRP.step2(M2Response.value.M2B64)
    return (resultSessionKey.isOk === true) ? "" : "Session key doesn't match the server"
}

changePw = action(async (oldPw: string, newPw: string, mode: "user" | "admin") => {
    if (this.acc === null) return
    const trySignIn = await this.signInWorker(this.acc.userName, oldPw, mode)
    if (trySignIn === "") {
        const clientSRP = new SecureRemotePassword(rfc5054.N_base16, rfc5054.g_base10, rfc5054.k_base16)

        const saltHex = await clientSRP.generateRandomSalt()
        const verifier = await clientSRP.generateVerifier(saltHex, this.acc.userName, newPw)
        const verifierHex = nonprefixedHexOfPositiveBI(verifier)
        await (mode === "user"
                ? this.client.userChangePw({ userName: this.acc.userName, saltB64: base64OfHex(saltHex), verifierB64: base64OfHex(verifierHex), })
                : this.client.adminChangePw({ userName: this.acc.userName, saltB64: base64OfHex(saltHex), verifierB64: base64OfHex(verifierHex), })
            )
        runInAction(() => this.applySuccessfulSignIn(mode, this.acc!.userName))
    } else {
        toast.error(trySignIn, { autoClose: 4000 })
    }
})

applySuccessfulSignIn = action((mode: "user" | "admin", userName: string) => {
    this.acc = { expiration: dateOfTS(new Date()), userName, status: mode }
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
