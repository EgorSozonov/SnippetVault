import { action, makeAutoObservable } from "mobx"
import UserStatus from "../types/UserStatus"


export default class UserState {
    public accessToken: string = ""
    public userName: string = ""
    public userId: number = -1
    public userStatus: UserStatus = "admin" // TODO guest

    constructor() {
        makeAutoObservable(this)
    }

    getName = action((name: string): void => {

    })

    signIn = action((userId: number, accessToken: string, userName: string): void => {
        if (accessToken.length < 1) return

        this.userStatus = "user"
        this.accessToken = accessToken
        this.userName = userName
        this.userId = userId
    })

    signInAdmin = action((userId: number, accessToken: string, userName: string): void => {
        if (accessToken.length < 1) return   

        this.userStatus = "admin"
        this.accessToken = accessToken
        this.userName = userName
        this.userId = userId
    })

    signOut = action((): void => {
        this.userStatus = "guest"
        this.accessToken = ""
        this.userName = ""
        this.userId = -1
    })
}