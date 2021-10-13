import { action, makeAutoObservable } from "mobx"
import MainState from "./MainState"


export default class AppState {
    public openSelect = ""
    public language1 = ""
    public language2 = ""
    public taskGroup = ""

    constructor(rootStore: MainState) {
        makeAutoObservable(this)
    }

    getName = action((name: string): void => {

    })
}