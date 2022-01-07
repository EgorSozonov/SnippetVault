import { action, makeAutoObservable } from "mobx"
import { ProfileDTO } from "../types/dto/UserDTO"
import UserStatus from "../types/UserStatus"


export default class UserState {
    public accessToken: string = ""
    public userName: string = ""
    public userId: number = -1
    public userStatus: UserStatus = "guest" // TODO guest
    public profile: ProfileDTO | null = null

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
        this.profile = null
        localStorage.removeItem("user")
    })

    setProfile = action((newValue: ProfileDTO[]): void => {
        this.profile = newValue.length === 1 ? newValue[0] : null
    })
}