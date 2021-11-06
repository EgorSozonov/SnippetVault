import { action, IObservableArray, makeAutoObservable, observable } from "mobx"
import LanguageDTO from "../../common/dto/LanguageDTO"
import SelectChoice from "../../common/types/SelectChoice"
import TaskGroupDTO from "../../common/dto/TaskGroupDTO"
import SnippetDTO from "../../common/dto/SnippetDTO"
import IClient from "../interfaces/IClient"
import MockClient from "../dataSource/mock/MockClient"
import createClient from "../Client"
import HttpClient from "../dataSource/http/HttpClient"
import SelectGroup from "../../common/types/SelectGroup"


export default class AppState {
    public openSelect = ""
    public language1: SelectChoice = {id: 0, name: ""}
    public languages: IObservableArray<SelectChoice> = observable.array([])
    public language2: SelectChoice = {id: 0, name: ""}
    public languageGroups: IObservableArray<SelectGroup> = observable.array([])
    public taskGroup: SelectChoice = {id: 0, name: ""}
    public taskGroups: IObservableArray<SelectChoice> = observable.array([])
    public snippets: IObservableArray<SnippetDTO> = observable.array([])
    public client: IClient = new MockClient()

    constructor() {
        makeAutoObservable(this)
        // const axios = createClient()
        // this.client = new HttpClient(axios)
    }

    setLanguage1 = action((newValue: SelectChoice): void => {
        this.language1 = newValue
    })

    setLanguage2 = action((newValue: SelectChoice): void => {
        this.language2 = newValue
    })

    setLanguageGroups = action((newValue: SelectGroup[]): void => {
        this.languageGroups = observable.array(newValue)
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

    setSnippets = action((newValue: SnippetDTO[]): void => {
        this.snippets = observable.array(newValue)
    })  
}