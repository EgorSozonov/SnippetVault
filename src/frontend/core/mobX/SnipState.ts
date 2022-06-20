import { action, IObservableArray, makeAutoObservable, observable } from "mobx"
import SelectChoice from "../types/SelectChoice"
import IClient from "../../ports/IClient"
import SnippetState, { updateId, updateLanguageChoices, updateLanguageId, updateLanguagesWithChoices, updateUrl, updateWithChoicesUrl, } from "../components/snippet/utils/SnippetState"
import { LanguageDTO, TaskGroupDTO, } from "../types/dto/AuxDTO"
import { SnippetDTO, AlternativesDTO, ProposalCreateDTO, } from "../types/dto/SnippetDTO"
import { CommentCUDTO, CommentDTO, StatsDTO, VoteDTO } from "../types/dto/UserDTO"
import { AlternativesSort } from "../components/alternative/utils/Types"
import { sortLanguages } from "../utils/Language"
import ServerResponse from "../types/ServerResponse"
import { fetchFromClient, fetchFromClient2 } from "./Utils"


export default class SnipState {
    public openSelect = ""
    public snippets: IObservableArray<SnippetDTO> = observable.array([])

    public l1: SnippetState = {type: "ChoicesAbsent", code: "", }
    public l2: SnippetState = {type: "ChoicesAbsent", code: "", }
    public tg: SnippetState = {type: "ChoicesAbsent", code: "", }
    public stats: StatsDTO | null = null

    public languages: IObservableArray<LanguageDTO> = observable.array([])
    public languageChoices: IObservableArray<SelectChoice> = observable.array([])

    public taskGroups: IObservableArray<SelectChoice> = observable.array([])
    public comments: IObservableArray<CommentDTO> = observable.array([])

    public alternatives: AlternativesDTO | null = null
    public alternativesSort: AlternativesSort = "byDate"

    public client: IClient

    constructor(client: IClient) {
        this.client = client
        makeAutoObservable(this)
    }

    snippetsSet = action((newValue: SnippetDTO[]): void => {
        this.snippets = observable.array(newValue)
    })

    snippetsGetByCode = action(async (tgCode: string, l1Code: string, l2Code: string) => {
        await fetchFromClient(this.client.snippetsByCode(tgCode, l1Code, l2Code), this.snippetsSet)
    })

    languagesGet = action(async () => {
        const resultLangs: ServerResponse<LanguageDTO[]> = await this.client.languagesGet()
        if (resultLangs.isOK === true) {
            this.languagesSet(resultLangs.value)
            const langList = sortLanguages(resultLangs.value)
            this.languageChoices = observable.array(langList)
            this.languagesChosenSet(langList)
        } else {
            console.log(resultLangs.errMsg)
        }
    })

    language1Chosen = action((newValue: SelectChoice): void => {
        const newL1 = updateLanguageId(this.l1, this.l2, this.languageChoices, newValue.id)
        this.l1 = newL1
        if (newL1.type === "ChoicesLoaded") {
            this.l2 = updateLanguageChoices(this.l2, newL1.choices)
        }
    })

    language2Chosen = action((newValue: SelectChoice): void => {
        const newL2 = updateLanguageId(this.l2, this.l1, this.languageChoices, newValue.id)
        this.l2 = newL2
        if (newL2.type === "ChoicesLoaded") {
            this.l1 = updateLanguageChoices(this.l1, newL2.choices)
        }
    })

    languagesChosenSet = action((newValue: SelectChoice[]): void => {
        if (newValue.length > 1) {
            const withoutFirstTwo: SelectChoice[] = newValue.slice(2)
            this.l1 = updateLanguagesWithChoices(this.l1, newValue[0], withoutFirstTwo)
            this.l2 = updateLanguagesWithChoices(this.l2, newValue[1], withoutFirstTwo)
        } else if (newValue.length === 1) {
            this.l1 = updateLanguagesWithChoices(this.l1, newValue[0], [])
            this.l2 = updateLanguagesWithChoices(this.l2, newValue[0], [])
        }
    })

    languagesSet = action((newValue: LanguageDTO[]): void => {
        this.languages = observable.array(newValue)
    })

    taskGroupChosen = action((newValue: SelectChoice): void => {
        this.tg = updateId(this.tg, this.taskGroups, newValue.id)
    })

    taskGroupsGet = action(async () => {
        await fetchFromClient(this.client.taskGroupsGet(), this.taskGroupsSet)
    })

    taskGroupsSet = action((newValue: TaskGroupDTO[]): void => {
        const newArr = newValue.map(x =>  {return {id: x.id, name: x.name, code: x.code, }})

        this.taskGroups = observable.array(newArr)
        this.tg = updateWithChoicesUrl(this.tg, newArr)
    })

    proposalCreate = action(async (dto: ProposalCreateDTO, userId: number) => {
        return await this.client.proposalCreate(dto, userId)
    })

    codesFromUrlSet = action((tgCode: string | null, l1Code: string | null, l2Code: string | null) => {
        if (tgCode !== null && tgCode.length > 0 && tgCode !== "undefined" && this.tg.code !== tgCode) {
            this.tg = updateUrl(this.tg, tgCode)
        }
        if (l1Code !== null && l1Code.length > 0 && l1Code !== "undefined" && this.l1.code !== l1Code) {
            this.l1 = updateUrl(this.l1, l1Code)
        }
        if (l2Code !== null && l2Code.length > 0 && l2Code !== "undefined" && this.l2.code !== l2Code) {
            this.l2 = updateUrl(this.l2, l2Code)
        }
    })

    openSelectSet = action((newValue: string): void => {
        this.openSelect = newValue
    })

    alternativesSet = action((newValue: AlternativesDTO): void => {

        console.log("alternativesSet")
        if (!newValue || newValue === null) {
            this.alternatives = null
            return
        }
        const alternativesNew = {...newValue}

        console.log(alternativesNew)
        const sorted = this.alternativesSort === "byDate"
            ? alternativesNew.rows.sort((x, y) => x.tsUpload < y.tsUpload ? 1 : -1)
            : alternativesNew.rows.sort((x, y) => y.score - x.score)

        this.alternatives = {task: alternativesNew.task, primary: alternativesNew.primary, rows: sorted, }
    })

    taskGet = action(async (id: number) => {
        return await this.client.taskGet(id)
    })

    alternativesGet = action(async (tlIdNum: number) => {
        await fetchFromClient2(this.client.alternativesGet(tlIdNum), this.alternativesSet)
    })

    alternativesGetUser = action(async (tlIdNum: number, userId: number) => {
        await fetchFromClient2(this.client.alternativesForUserGet(tlIdNum, userId), this.alternativesSet)
    })

    alternativesResort = action((newValue: AlternativesSort): void => {
        this.alternativesSort = newValue
        if (this.alternatives === null) {
            return
        }

        const sorted = newValue === "byDate"
            ? this.alternatives.rows.sort((x, y) => x.tsUpload < y.tsUpload ? 1 : -1)
            : this.alternatives.rows.sort((x, y) => y.score - x.score)
        this.alternatives.rows = sorted
    })

    snippetMarkPrimary = action((tlId: number, snId: number, userId: number): void => {
        this.client.snippetMarkPrimary(tlId, snId, userId)
        .then((r) => {
                if (r && r.status === "OK") {
                    fetchFromClient2(this.client.alternativesForUserGet(tlId, userId), this.alternativesSet)
                }
            })
    })

    commentsGet = action(async (snId: number) => {
        await fetchFromClient(this.client.commentsGet(snId), this.commentsSet)
    })

    commentsSet = action((newValue: CommentDTO[]): void => {
        if (!newValue) {
            this.comments = observable.array([])
            return
        }

        this.comments = observable.array(newValue.sort((x, y) => x.tsUpload < y.tsUpload ? 1 : -1))
    })

    commentCreate = action((dto: CommentCUDTO, userId: number, id2: number) => {
        this.client.commentCreate(dto, userId)
            .then((r) => {
                if (r && r.status === "OK") {
                    this.alternativesGetUser(id2, userId)
                }
            })
    })

    userVote = action((voteDto: VoteDTO, userId: number) => {
        console.log("userVote")
        this.client.userVote(voteDto, userId)
            .then((r) => {
                console.log(r)
                if (r && r.status === "OK") {
                    console.log("here")
                    fetchFromClient2(this.client.alternativesForUserGet(voteDto.tlId, userId), this.alternativesSet)
                }
            })
    })

}
