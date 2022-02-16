import { action, IObservableArray, makeAutoObservable, observable } from "mobx"
import SelectChoice from "../types/SelectChoice"
import IClient from "../../ports/IClient"
import { LanguageCUDTO, LanguageDTO, TaskCUDTO, TaskGroupCUDTO, TaskGroupDTO } from "../types/dto/AuxDTO"
import { SnippetDTO, ProposalDTO, BareSnippetDTO, ProposalUpdateDTO } from "../types/dto/SnippetDTO"
import { StatsDTO } from "../types/dto/UserDTO"
import { fetchFromClient } from "./Utils"
import { SignInSuccessDTO } from "../types/dto/AuthDTO"


export default class AdminState {
    public openSelect = ""
    public snippets: IObservableArray<SnippetDTO> = observable.array([])
    public stats: StatsDTO | null = null

    public tasks: IObservableArray<TaskCUDTO> = observable.array([])

    public languages: IObservableArray<LanguageCUDTO> = observable.array([])

    public proposals: IObservableArray<ProposalDTO> = observable.array([])

    public taskGroups: IObservableArray<TaskGroupCUDTO> = observable.array([])

    public editProposal: BareSnippetDTO | null = null

    public client: IClient

    constructor(client: IClient) {
        this.client = client
        makeAutoObservable(this)
    }

    proposalsGet = action(async () => {
        await fetchFromClient(this.client.proposalsGet(), this.proposalsSet)
    })

    proposalsSet = action((newValue: ProposalDTO[]): void => {
        this.proposals = observable.array(newValue)
    })

    proposalGet = action(async (snId: number) => {
        await fetchFromClient(this.client.proposalGet(snId), this.editProposalSet)
    })

    editProposalSet = action((newValue: BareSnippetDTO[]): void => {
        if (!newValue || newValue.length !== 1) this.editProposal = null
        this.editProposal = newValue[0]
    })

    proposalUpdate = action(async (newValue: ProposalUpdateDTO, headers: SignInSuccessDTO) => {
        await this.client.proposalUpdate(newValue, headers)
    })

    proposalApprove = action((pId: number, headers: SignInSuccessDTO) => {
        this.client.proposalApprove(pId, headers)
            .then((r) => {
                if (r.status === "OK") {
                    fetchFromClient(this.client.proposalsGet(), this.proposalsSet)
                }
            })
    })

    proposalDecline = action((pId: number, headers: SignInSuccessDTO) => {
        this.client.proposalDecline(pId, headers)
        .then((r) => {
                if (r.status === "OK") {
                    fetchFromClient(this.client.proposalsGet(), this.proposalsSet)
                }
            })
    })

    tasksGet = action(async () => {
        await fetchFromClient(this.client.tasksAll(), this.tasksSet)
    })

    tasksSet = action((newValue: TaskCUDTO[]): void => {
        if (!newValue) {
            this.tasks = observable.array([])
            return
        }
        this.tasks = observable.array(newValue)
    })

    taskCU = action((newValue: TaskCUDTO, headers: SignInSuccessDTO) => {
        this.client.taskCU(newValue, headers)
    })

    taskGroupsGet = action(async () => {
        await fetchFromClient(this.client.taskGroupsAll(), this.taskGroupsSet)
    })

    taskGroupsSet = action((newValue: TaskGroupCUDTO[]): void => {
        if (!newValue) {
            this.tasks = observable.array([])
            return
        }
        this.taskGroups = observable.array(newValue)
    })

    taskGroupCU = action((newValue: TaskGroupCUDTO, headers: SignInSuccessDTO) => {
        this.client.taskGroupCU(newValue, headers)
    })

    languagesGet = action(async () => {
        await fetchFromClient(this.client.languagesAll(), this.languagesSet)
    })

    languagesSet = action((newValue: LanguageCUDTO[]): void => {
        if (!newValue) {
            this.tasks = observable.array([])
            return
        }
        this.languages = observable.array(newValue)
    })

    languageCU = action((newValue: LanguageCUDTO, headers: SignInSuccessDTO) => {
        this.client.languageCU(newValue, headers)
    })

    statsGet = action(async () => {
        await fetchFromClient(this.client.adminStatsGet(), this.statsSet)
    })

    statsSet = action((newValue: StatsDTO[]): void => {
        this.stats = newValue.length === 1 ? newValue[0] : null
    })

}
