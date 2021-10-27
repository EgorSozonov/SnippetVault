import { action, makeAutoObservable } from "mobx"


export default class UserState {
    public authToken: string = ""
    public userName: string = ""

    constructor() {
        makeAutoObservable(this)
    }

    getName = action((name: string): void => {

    })
}