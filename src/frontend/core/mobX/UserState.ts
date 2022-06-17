import { action, computed, makeAutoObservable, runInAction } from "mobx"
import IClient from "../../ports/IClient"
import { ChangePwAdminDTO, ChangePwDTO, HandshakeResponseDTO, SignInAdminDTO, SignInResponseDTO } from "../types/dto/AuthDTO"
import { ProfileDTO } from "../types/dto/UserDTO"
import ServerEither from "../types/ServerEither"
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
        console.log("Handshake response was incorrect")
        return
    }

    const {AB64, M1B64} = mbAM1.value

    const M2Response = processSignIn(await this.client.userSignIn({AB64, M1B64, userName}), "user")
    if (M2Response.isOK === false) return

    const resultSessionKey = await clientSRP.step2(M2Response.value.M2B64)
    if (resultSessionKey.isOk === false) return

    const sessionKey = base64OfBigInt(resultSessionKey.value)
    this.acc = {userId: M2Response.value.userId, expiration: dateOfTS(new Date()), name: userName, status: "user", }
    console.log("Session Key = " + sessionKey + ", userId = " + M2Response.value.userId)
})

changePw = action(async (dto: ChangePwDTO) => {
    const response = await this.client.userChangePw(dto)
    this.applySignInResponse(response, "user", dto.signIn.userName)
})

signInAdmin = action(async (dto: SignInAdminDTO) => {
    const response = await this.client.userSignInAdmin(dto)
    this.applySignInResponse(response, "admin", dto.userName)
})

changeAdminPw = action(async (dto: ChangePwAdminDTO) => {
    const response = await this.client.userChangeAdminPw(dto)
    this.applySignInResponse(response, "admin", dto.signIn.userName)
})

applySignInResponse = action((response: ServerResponse<ServerEither<SignInResponseDTO>>, status: "user" | "admin", userName: string) => {
    const mbAccount = processSignIn(response, status)

    if (mbAccount.isOK) {
        this.acc = { expiration: dateOfTS(new Date()), name: userName, status, userId: mbAccount.value.userId }
        localStorage.setItem("account", JSON.stringify(mbAccount))
    }
})

private accountsEq(a1: UserAccount | null, a2: UserAccount): boolean {
    if (a1 === null) return false
    return (a1.userId === a2.userId
            && a1.expiration.year === a2.expiration.year
            && a1.expiration.month === a2.expiration.month
            && a1.expiration.day === a2.expiration.day);
}

trySignInFromLS = action(() => {
    const fromLS = localStorage.getItem("account")
    if (!fromLS || fromLS.length < 1 || fromLS === "undefined") return;

    const accFromLS: UserAccount = JSON.parse(fromLS)

    if (accFromLS.userId && accFromLS.userId > -1
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

profileGet = action(async (userId: number) => {
    await fetchFromClient(this.client.userProfile(userId), this.profileSet)
})

profileSet = action((newValue: ProfileDTO[]): void => {
    this.profile = newValue.length === 1 ? newValue[0] : null
})

userIdGet = action((): number | null => {
    return this.acc?.userId ?? null
})

}

// userName Yolo
// password asdfasdf
