import { action, makeAutoObservable } from "mobx"
import MainState from "./MainState"


export default class AppState {
    public openSelect = ""
    public language1 = ""
    public language2 = ""
    public taskGroup = ""

    constructor() {
        makeAutoObservable(this)
    }

    setLanguage1 = action((newValue: string): void => {
        this.language1 = newValue
    })

    setLanguage2 = action((newValue: string): void => {
        this.language2 = newValue
    })

    setTaskGroup = action((newValue: string): void => {
        this.taskGroup = newValue
    })    

    setOpenSelect = action((newValue: string): void => {
        this.openSelect = newValue
    })   
}