import { action, computed, makeAutoObservable } from "mobx"
import IClient from "../../ports/IClient"
import { ChangePwAdminDTO, ChangePwDTO, RegisterDTO, SignInAdminDTO, SignInDTO, SignInSuccessDTO } from "../types/dto/AuthDTO"
import { ProfileDTO } from "../types/dto/UserDTO"
import EitherMsg from "../types/EitherMsg"
import { UserAccount } from "../types/UserAccount"
import { isSameDay } from "../utils/DateUtils"
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

    userRegister = action(async (dto: RegisterDTO) => {
        return processHandshake(await this.client.userRegister(dto), "user")
    })

    userHandshake = action(() => {

    })

    userSignIn = action((A: string, M1: string, userName: string) => {
        return this.client.userSignIn({ userName, A, M1 })
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

    applySignInResponse = action((response: EitherMsg<SignInSuccessDTO[]>, status: "user" | "admin", userName: string) => {
        const mbAccount = processSignIn(response, status, userName)

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
