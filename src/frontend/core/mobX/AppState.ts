import { action, IObservableArray, makeAutoObservable, observable } from "mobx"
import SelectChoice from "../types/SelectChoice"
import IClient from "../../ports/IClient"
import SelectGroup from "../types/SelectGroup"
import HttpClient from "../../ports/http/HttpClient"
import MockClient from "../../ports/mock/MockClient"
import CodesFromUrl from "../components/snippet/utils/CodesFromUrl"
import SnippetState, { updateId, updateUrl, updateWithChoicesUrl, } from "../components/snippet/utils/SnippetState"
import { LanguageDTO, LanguageGroupDTO, TaskGroupDTO } from "../types/dto/AuxDTO"
import { SnippetDTO, ProposalDTO, AlternativesDTO } from "../types/dto/SnippetDTO"
import { ProfileDTO, StatsDTO } from "../types/dto/UserDTO"


export default class AppState {
    public openSelect = ""
    public snippets: IObservableArray<SnippetDTO> = observable.array([])

    public language1: SelectChoice = {id: 0, name: ""}    
    public language2: SelectChoice = {id: 0, name: ""}
    public codesFromUrl: CodesFromUrl = { tg: "", lang1: "", lang2: "", }
    public taskGroup: SelectChoice = {id: 0, name: ""}


    public l1: SnippetState = {type: "ChoicesAbsent", code: "", }
    public l2: SnippetState = {type: "ChoicesAbsent", code: "", }
    public tg: SnippetState = {type: "ChoicesAbsent", code: "", }
    public stats: StatsDTO | null = null

    public languages: IObservableArray<LanguageDTO> = observable.array([])
    public groupedLanguages: IObservableArray<SelectGroup> = observable.array([])
    public languageGroups: IObservableArray<LanguageGroupDTO> = observable.array([])

    public proposals: IObservableArray<ProposalDTO> = observable.array([])
    
    public taskGroups: IObservableArray<SelectChoice> = observable.array([])

    public alternatives: IObservableArray<AlternativesDTO> = observable.array([])
    public client: IClient = new HttpClient()

    constructor() {
        makeAutoObservable(this)
        // const axios = createClient()
        // this.client = new HttpClient(axios)
    }

    setSnippets = action((newValue: SnippetDTO[]): void => {
        this.snippets = observable.array(newValue)
    })  

    setLanguage1 = action((newValue: SelectChoice): void => {
        this.l1 = updateId(this.l1, newValue.id)
    })

    setLanguage2 = action((newValue: SelectChoice): void => {
        this.l2 = updateId(this.l2, newValue.id)
    })

    setTaskGroup = action((newValue: SelectChoice): void => {
        this.tg = updateId(this.tg, newValue.id)
    })

    setLanguageList = action((newValue: SelectChoice[]): void => {
        this.l1 = updateWithChoicesUrl(this.l1, newValue)
        this.l2 = updateWithChoicesUrl(this.l2, newValue)
    }) 

    setTaskGroups = action((newValue: TaskGroupDTO[]): void => {
        const newArr = newValue.map(x =>  {return {id: x.id, name: x.name, code: x.code, }})
        this.taskGroups = observable.array(newArr)
        this.tg = updateWithChoicesUrl(this.tg, newArr)
    })  


    setCodesFromUrl = action((tgCode: string, l1Code: string, l2Code: string) => {
        if (tgCode.length > 0 && tgCode !== "undefined" && this.tg.code === "") {
            this.tg = updateUrl(this.tg, tgCode)
        }
        if (l1Code.length > 0 && l1Code !== "undefined" && this.l1.code === "") {
            this.l1 = updateUrl(this.l1, l1Code)
        }
        if (l2Code.length > 0 && l2Code !== "undefined" && this.l2.code === "") {  
            this.l2 = updateUrl(this.l2, l2Code)
        }
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

    setOpenSelect = action((newValue: string): void => {
        this.openSelect = newValue
    })

    setLanguages = action((newValue: LanguageDTO[]): void => {
        this.languages = observable.array(newValue)
    }) 

    setAlternatives = action((newValue: AlternativesDTO[]): void => {
        this.alternatives = observable.array(newValue)
    })

    setStats = action((newValue: StatsDTO[]): void => {
        this.stats = newValue.length === 1 ? newValue[0] : null
    })
}