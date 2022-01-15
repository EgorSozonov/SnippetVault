import { action, makeAutoObservable } from "mobx"
import IClient from "../../ports/IClient"
import { ChangePwDTO, SignInDTO, SignInSuccessDTO } from "../components/dto/AuthDTO"
import { ProfileDTO } from "../components/dto/UserDTO"
import EitherMsg from "../types/EitherMsg"
import { UserAccount, UserStatus } from "../types/UserAccount"
import { dateOfTS, isSameDay } from "../utils/DateUtils"


export default class UserState {
    public acc: UserAccount | null = null
    public profile: ProfileDTO | null = null
    client: IClient

    constructor(client: IClient) {
        this.client = client
        makeAutoObservable(this)
    }

    isUser = action(() => {
        return (this.acc !== null && this.acc.status === "user")
    })

    isAdmin = action(() => {
        return (this.acc !== null && this.acc.status === "admin")
    })

    signInOrRegister = action(async (dto: SignInDTO, mode: "signIn" | "register"): Promise<void> => {
        const response = mode === "signIn" ? await this.client.userSignIn(dto) : await this.client.userRegister(dto)
        this.applySignInResponse(response, dto.userName)
    })

    changePw = action(async (dto: ChangePwDTO, headers: SignInSuccessDTO): Promise<void> => {
        const response = await this.client.userChangePw(dto, headers)
        this.applySignInResponse(response, dto.signIn.userName)
    })

    signInAdmin = action((userId: number, accessToken: string, userName: string): void => {
        if (accessToken.length < 1) return   

        const expiration = dateOfTS(new Date())
        const account: UserAccount = {name: userName, expiration, accessToken, userId, status: "admin", }
        console.log("signing in admin")
        console.log(account)
        localStorage.setItem("account", JSON.stringify(account))
        this.acc = account
    })

    applySignInResponse = action((response: EitherMsg<SignInSuccessDTO[]>, userName: string) => {
        if (response.isOK === false) {
            console.log(response.errMsg)
            return
        } else if (response.value.length < 1) {
            console.log("Error: empty response")
            return
        } else if (response.value[0].accessToken.length < 1) {
            console.log("Error: empty access token")
        }

        const successDTO = response.value[0]
        const expiration = dateOfTS(new Date())
        const account: UserAccount = {
            name: userName, expiration, accessToken: successDTO.accessToken, userId: successDTO.userId, status: "user", 
        }
        localStorage.setItem("account", JSON.stringify(account))
        this.acc = account
    })

    trySignInFromLS = action(() => {
        const fromLS = localStorage.getItem("account")        
        if (fromLS && fromLS.length > 0 && fromLS !== "undefined") {
            const accFromLS: UserAccount = JSON.parse(fromLS)
            if (accFromLS.userId && accFromLS.userId > -1 
                  && accFromLS.accessToken && accFromLS.accessToken.length > 0
                  && (accFromLS.status === "admin" || accFromLS.status === "user")
                  && isSameDay(new Date(), accFromLS.expiration) === true) {
                this.acc = accFromLS
            }
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

    profileSet = action((newValue: ProfileDTO[]): void => {
        this.profile = newValue.length === 1 ? newValue[0] : null
    })

    headersGet = action((): SignInSuccessDTO | null => {
        if (this.acc === null) return null
        return { userId: this.acc.userId, accessToken: this.acc.accessToken, }
    })
}