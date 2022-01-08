import { action, makeAutoObservable } from "mobx"
import { SignInSuccessDTO } from "../types/dto/AuthDTO"
import { ProfileDTO } from "../types/dto/UserDTO"
import { UserAccount, UserStatus } from "../types/UserAccount"
import { dateOfTS, isSameDay } from "../utils/DateUtils"


export default class UserState {
    public acc: UserAccount | null = null
    public profile: ProfileDTO | null = null

    constructor() {
        makeAutoObservable(this)
    }

    isUser = action(() => {
        return (this.acc !== null && this.acc.status === "user")
    })

    isAdmin = action(() => {
        return (this.acc !== null && this.acc.status === "admin")
    })

    signIn = action((userId: number, accessToken: string, userName: string): void => {
        if (accessToken.length < 1) return
        const expiration = dateOfTS(new Date())
        const account: UserAccount = {name: userName, expiration, accessToken, userId, status: "user", }
        localStorage.setItem("account", JSON.stringify(account))
        this.acc = account
    })

    signInAdmin = action((userId: number, accessToken: string, userName: string): void => {
        if (accessToken.length < 1) return   

        const expiration = dateOfTS(new Date())
        const account: UserAccount = {name: userName, expiration, accessToken, userId, status: "admin", }
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