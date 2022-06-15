import { action, computed, makeAutoObservable } from "mobx"
import IClient from "../../ports/IClient"
import { ChangePwAdminDTO, ChangePwDTO, HandshakeDTO, HandshakeResponseDTO, RegisterDTO, SignInAdminDTO, SignInDTO, SignInResponseDTO, SignInSuccessDTO } from "../types/dto/AuthDTO"
import { ProfileDTO } from "../types/dto/UserDTO"
import ServerEither from "../types/ServerEither"
import ServerResponse from "../types/ServerResponse"
import { UserAccount } from "../types/UserAccount"
import { rfc5054 } from "../utils/Constants"
import { isSameDay } from "../utils/DateUtils"
import SecureRemotePassword from "../utils/SecureRemotePassword"
import { base64OfHex, bigintOfBase64, bigintOfHex, nonprefixedHexOfPositiveBI } from "../utils/StringUtils"
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
    this.userFinishSignIn(handshakeResponse, userName, password, clientSRP)
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

    console.log("M1")
    console.log(bigintOfBase64(M1B64).toString())
    const M2Response = processSignIn(await this.client.userSignIn({AB64, M1B64, userName}), "user")
    console.log("M2")
    console.log(M2Response)
    if (M2Response.isOK === false) return

    const result2 = await clientSRP.step2(M2Response.value.M2B64)
    if (result2.isOk === false) return

    const userId: number = M2Response.value.userId

    const sessionKey = result2.value
    console.log("userId = " + userId)
    console.log("Session Key = " + sessionKey)
})

changePw = action(async (dto: ChangePwDTO, headers: SignInSuccessDTO) => {
    const response = await this.client.userChangePw(dto, headers)
    this.applySignInResponse(response, "user", dto.signIn.userName)
})

signInAdmin = action(async (dto: SignInAdminDTO) => {
    const response = await this.client.userSignInAdmin(dto)
    this.applySignInResponse(response, "admin", dto.userName)
})

changeAdminPw = action(async (dto: ChangePwAdminDTO, headers: SignInSuccessDTO) => {
    const response = await this.client.userChangeAdminPw(dto, headers)
    this.applySignInResponse(response, "admin", dto.signIn.userName)
})

applySignInResponse = action((response: ServerResponse<ServerEither<SignInResponseDTO>>, status: "user" | "admin", userName: string) => {
    const mbAccount = processSignIn(response, status)

    if (mbAccount !== null) {
        this.acc = mbAccount
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

profileGet = action(async (headers: SignInSuccessDTO) => {
    await fetchFromClient(this.client.userProfile(headers), this.profileSet)
})

profileSet = action((newValue: ProfileDTO[]): void => {
    this.profile = newValue.length === 1 ? newValue[0] : null
})

headersGet = action((): SignInSuccessDTO | null => {
    if (this.acc === null) return null
    return { userId: this.acc.userId }
})
}
