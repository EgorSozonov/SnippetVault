import { action, makeAutoObservable } from "mobx"
import UserStatus from "../types/UserStatus"


export default class UserState {
    public authToken: string = ""
    public userName: string = ""
    public userStatus: UserStatus = "guest"

    constructor() {
        makeAutoObservable(this)
    }

    getName = action((name: string): void => {

    })

    setUserStatus = action((newStatus: UserStatus): void => {
        this.userStatus = newStatus
    })
}