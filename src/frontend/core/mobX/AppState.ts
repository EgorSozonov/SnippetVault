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
import CodesFromUrl from "../types/CodesFromUrl"
import SnippetState, { updateId, updateWithChoicesUrl } from "../types/SnippetState"


export default class AppState {
    public openSelect = ""
    public snippets: IObservableArray<SnippetDTO> = observable.array([])


    public language1: SelectChoice = {id: 0, name: ""}    
    public language2: SelectChoice = {id: 0, name: ""}
    public codesFromUrl: CodesFromUrl = { tg: "", lang1: "", lang2: "", }
    public taskGroup: SelectChoice = {id: 0, name: ""}


    public l1: SnippetState = {type: "UrlChangedNoChoices", code: "", }
    public l2: SnippetState = {type: "UrlChangedNoChoices", code: "", }
    public tg: SnippetState = {type: "UrlChangedNoChoices", code: "", }


    public languages: IObservableArray<LanguageDTO> = observable.array([])
    public groupedLanguages: IObservableArray<SelectGroup> = observable.array([])
    public languageGroups: IObservableArray<LanguageGroupDTO> = observable.array([])

    public proposals: IObservableArray<ProposalDTO> = observable.array([])
    
    public taskGroups: IObservableArray<SelectChoice> = observable.array([])

    public alternatives: IObservableArray<AlternativeDTO> = observable.array([])
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
        
        //this.language1 = newValue
        //this.refreshCodesFromSelects()
    })

    setLanguage2 = action((newValue: SelectChoice): void => {
        this.l2 = updateId(this.l2, newValue.id)

        //this.language2 = newValue
        //this.refreshCodesFromSelects()
    })

    setTaskGroup = action((newValue: SelectChoice): void => {
        this.tg = updateId(this.tg, newValue.id)

        //this.taskGroup = newValue
        //this.refreshCodesFromSelects()
    }) 

    setCodesFromUrl = action((newValue: CodesFromUrl): void => {        
        this.codesFromUrl = newValue
        this.refreshSelectsFromCodes(newValue)
    })

    setLanguageList = action((newValue: SelectChoice[]): void => {
        this.l1 = updateWithChoicesUrl(this.l1, newValue)
        this.l2 = updateWithChoicesUrl(this.l2, newValue)
    }) 

    setTaskGroups = action((newValue: TaskGroupDTO[]): void => {
        const newArr = newValue.map(x =>  {return {id: x.id, name: x.name, code: x.code, }})
        this.taskGroups = observable.array(newArr)
        this.refreshSelectsFromCodes(this.codesFromUrl)
        this.tg = updateWithChoicesUrl(this.tg, newArr)
    })  

    /**
     * Try refreshing ids of selected langs/tg from URL codes.
     * Might fail if the languages or TGs aren't loaded yet.
     */
    refreshSelectsFromCodes = action((newValue: CodesFromUrl) => {        
        if (this.taskGroups.length > 0 && newValue.tg.length > 0) {            
            const tryTG = this.taskGroups.find(x => x.code === newValue.tg)
            if (tryTG) this.taskGroup = tryTG            
        }
        if (this.groupedLanguages.length > 0) {
            for (let lg of this.groupedLanguages) {
                if (newValue.lang1.length > 0) {
                    let tryLang = lg.choices.find(x => x.code === newValue.lang1)
                    if (tryLang) this.language1 = tryLang
                }
                if (newValue.lang2.length > 0) {
                    let tryLang = lg.choices.find(x => x.code === newValue.lang2)
                    if (tryLang) this.language2 = tryLang
                }                
            }
        }
    })

    /**
     * Refresh codes of selected langs/tg from ids
     */
    refreshCodesFromSelects = action(() => {
        if (this.language1.code && this.language1.code.length > 0 && this.language2.code && this.language2.code.length > 0 
        && this.taskGroup.code && this.taskGroup.code.length > 0) {
            this.codesFromUrl = {tg: this.taskGroup.code, lang1: this.language1.code, lang2: this.language2.code, }            
        }
    })

    setGroupedLanguages = action((newValue: SelectGroup[]): void => {
        this.groupedLanguages = observable.array(newValue)
        this.refreshSelectsFromCodes(this.codesFromUrl)
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



    setAlternatives = action((newValue: AlternativeDTO[]): void => {
        this.alternatives = observable.array(newValue)
    })
}