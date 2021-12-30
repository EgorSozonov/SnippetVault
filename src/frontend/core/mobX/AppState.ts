import { action, IObservableArray, makeAutoObservable, observable } from "mobx"
import SelectChoice from "../types/SelectChoice"
import TaskGroupDTO from "../types/dto/TaskGroupDTO"
import SnippetDTO from "../types/dto/SnippetDTO"
import IClient from "../../ports/IClient"
import AlternativeDTO from "../types/dto/AlternativeDTO"
import LanguageGroupDTO from "../types/dto/LanguageGroupDTO"
import SelectGroup from "../types/SelectGroup"
import LanguageDTO from "../types/dto/LanguageDTO"
import ProposalDTO from "../types/dto/ProposalDTO"
import HttpClient from "../../ports/http/HttpClient"
import MockClient from "../../ports/mock/MockClient"


export default class AppState {
    public openSelect = ""
    public snippets: IObservableArray<SnippetDTO> = observable.array([])
    public language1: SelectChoice = {id: 0, name: ""}
    public languages: IObservableArray<LanguageDTO> = observable.array([])
    public language2: SelectChoice = {id: 0, name: ""}
    public groupedLanguages: IObservableArray<SelectGroup> = observable.array([])
    public languageGroups: IObservableArray<LanguageGroupDTO> = observable.array([])
    public proposals: IObservableArray<ProposalDTO> = observable.array([])
    public taskGroup: SelectChoice = {id: 0, name: ""}
    public taskGroups: IObservableArray<SelectChoice> = observable.array([])

    public alternatives: IObservableArray<AlternativeDTO> = observable.array([])
    public client: IClient = new MockClient()

    constructor() {
        makeAutoObservable(this)
        // const axios = createClient()
        // this.client = new HttpClient(axios)
    }

    setSnippets = action((newValue: SnippetDTO[]): void => {
        this.snippets = observable.array(newValue)
    })  

    setLanguage1 = action((newValue: SelectChoice): void => {
        this.language1 = newValue
    })

    setLanguage2 = action((newValue: SelectChoice): void => {
        this.language2 = newValue
    })

    setGroupedLanguages = action((newValue: SelectGroup[]): void => {
        this.groupedLanguages = observable.array(newValue)
    })

    setLanguageGroups = action((newValue: LanguageGroupDTO[]): void => {
        this.languageGroups = observable.array(newValue)
    })

    setProposals = action((newValue: ProposalDTO[]): void => {
        this.proposals = observable.array(newValue)
    })    

    setTaskGroup = action((newValue: SelectChoice): void => {
        this.taskGroup = newValue
    })    

    setOpenSelect = action((newValue: string): void => {
        this.openSelect = newValue
    })

    setLanguages = action((newValue: LanguageDTO[]): void => {
        this.languages = observable.array(newValue)
    }) 

    setTaskGroups = action((newValue: TaskGroupDTO[]): void => {
        this.taskGroups = observable.array(newValue.map(x =>  {return {id: x.id, name: x.name}}))
    })  

    setAlternatives = action((newValue: AlternativeDTO[]): void => {
        console.log("newValue")
        console.log(newValue)
        this.alternatives = observable.array(newValue)
    })  

}