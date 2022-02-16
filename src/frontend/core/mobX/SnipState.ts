import { action, IObservableArray, makeAutoObservable, observable } from "mobx"
import SelectChoice from "../types/SelectChoice"
import IClient from "../../ports/IClient"
import SnippetState, { updateId, updateUrl, updateWithChoicesUrl as updateWithNewlyReceivedChoices, } from "../components/snippet/utils/SnippetState"
import { LanguageDTO, TaskGroupDTO, } from "../types/dto/AuxDTO"
import { SnippetDTO, AlternativesDTO, ProposalCreateDTO, } from "../types/dto/SnippetDTO"
import { CommentCUDTO, CommentDTO, StatsDTO, VoteDTO } from "../types/dto/UserDTO"
import { AlternativesSort } from "../components/alternative/utils/Types"
import { sortLanguages } from "../utils/languageGroup/GroupLanguages"
import EitherMsg from "../types/EitherMsg"
import { fetchFromClient } from "./Utils"
import { SignInSuccessDTO } from "../types/dto/AuthDTO"


export default class SnipState {
    public openSelect = ""
    public snippets: IObservableArray<SnippetDTO> = observable.array([])

    public l1: SnippetState = {type: "ChoicesAbsent", code: "", }
    public l2: SnippetState = {type: "ChoicesAbsent", code: "", }
    public tg: SnippetState = {type: "ChoicesAbsent", code: "", }
    public stats: StatsDTO | null = null

    public languages: IObservableArray<LanguageDTO> = observable.array([])

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
        const resultLangs: EitherMsg<LanguageDTO[]> = await this.client.languagesGet()
        if (resultLangs.isOK === true) {
            const langList = sortLanguages(resultLangs.value)
            this.languageListSet(langList)
            this.languagesSet(resultLangs.value)
        } else {
            console.log(resultLangs.errMsg)
        }
    })

    language1Set = action((newValue: SelectChoice): void => {
        this.l1 = updateId(this.l1, newValue.id)
    })

    language2Set = action((newValue: SelectChoice): void => {
        this.l2 = updateId(this.l2, newValue.id)
    })

    languageListSet = action((newValue: SelectChoice[]): void => {
        this.l1 = updateWithNewlyReceivedChoices(this.l1, newValue)
        this.l2 = updateWithNewlyReceivedChoices(this.l2, newValue)
    })

    languagesSet = action((newValue: LanguageDTO[]): void => {
        this.languages = observable.array(newValue)
    })

    taskGroupSet = action((newValue: SelectChoice): void => {
        this.tg = updateId(this.tg, newValue.id)
    })

    taskGroupsGet = action(async () => {
        await fetchFromClient(this.client.taskGroupsGet(), this.taskGroupsSet)
    })

    taskGroupsSet = action((newValue: TaskGroupDTO[]): void => {
        const newArr = newValue.map(x =>  {return {id: x.id, name: x.name, code: x.code, }})

        this.taskGroups = observable.array(newArr)
        this.tg = updateWithNewlyReceivedChoices(this.tg, newArr)
    })

    proposalCreate = action(async (dto: ProposalCreateDTO, headers: SignInSuccessDTO) => {
        return await this.client.proposalCreate(dto, headers)
    })

    codesFromUrlSet = action((tgCode: string, l1Code: string, l2Code: string) => {
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

    openSelectSet = action((newValue: string): void => {
        this.openSelect = newValue
    })

    alternativesSet = action((newValue: AlternativesDTO[]): void => {
        if (!newValue || newValue === null || newValue.length !== 1) {
            this.alternatives = null
            return
        }
        const alternativesNew = newValue[0]
        const sorted = this.alternativesSort === "byDate"
            ? alternativesNew.rows.sort((x, y) => x.tsUpload < y.tsUpload ? 1 : -1)
            : alternativesNew.rows.sort((x, y) => y.score - x.score)

        this.alternatives = {task: alternativesNew.task, primary: alternativesNew.primary, rows: sorted, }
    })

    taskGet = action(async (id: number) => {
        return await this.client.taskGet(id)
    })

    alternativesGet = action(async (tlIdNum: number) => {
        await fetchFromClient(this.client.alternativesGet(tlIdNum), this.alternativesSet)
    })

    alternativesGetUser = action(async (tlIdNum: number, userId: number) => {
        await fetchFromClient(this.client.alternativesForUserGet(tlIdNum, userId), this.alternativesSet)
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

    commentCreate = action((dto: CommentCUDTO, headers: SignInSuccessDTO, id2: number) => {
        this.client.commentCreate(dto, headers)
            .then((r) => {
                if (r && r.status === "OK") {
                    this.alternativesGetUser(id2, headers.userId)
                }
            })
    })

    userVote = action((voteDto: VoteDTO, headers: SignInSuccessDTO) => {
        this.client.userVote(voteDto, headers)
            .then((r) => {
                if (r && r.status === "OK") {
                    fetchFromClient(this.client.alternativesForUserGet(voteDto.tlId, headers.userId), this.alternativesSet)
                }
            })
    })

}
