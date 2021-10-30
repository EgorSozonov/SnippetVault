import { action, IObservableArray, makeAutoObservable, observable } from "mobx"
import LanguageDTO from "../../common/dto/LanguageDTO"
import SelectChoice from "../../common/types/SelectChoice"
import TaskGroupDTO from "../../common/dto/TaskGroupDTO"
import MainState from "./MainState"


export default class AppState {
    public openSelect = ""
    public language1: SelectChoice = {id: 0, name: ""}
    public languages: IObservableArray<SelectChoice> = observable.array([])
    public language2: SelectChoice = {id: 0, name: ""}
    public taskGroup: SelectChoice = {id: 0, name: ""}
    public taskGroups: IObservableArray<SelectChoice> = observable.array([])

    constructor() {
        makeAutoObservable(this)
    }

    setLanguage1 = action((newValue: SelectChoice): void => {
        this.language1 = newValue
    })

    setLanguage2 = action((newValue: SelectChoice): void => {
        this.language2 = newValue
    })

    setTaskGroup = action((newValue: SelectChoice): void => {
        this.taskGroup = newValue
    })    

    setOpenSelect = action((newValue: string): void => {
        this.openSelect = newValue
    })

    setLanguages = action((newValue: LanguageDTO[]): void => {
        this.languages = observable.array(newValue.map(x =>  {return {id: x.id, name: x.name}}))
    }) 

    setTaskGroups = action((newValue: TaskGroupDTO[]): void => {
        this.taskGroups = observable.array(newValue.map(x =>  {return {id: x.id, name: x.name}}))
    })  
}