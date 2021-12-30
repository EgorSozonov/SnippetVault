import { AxiosInstance } from "axios"
import AlternativeDTO from "../../core/types/dto/AlternativeDTO"
import LanguageGroupedDTO from "../../core/types/dto/LanguageGroupedDTO"
import LanguageGroupDTO from "../../core/types/dto/LanguageGroupDTO"
import LanguageDTO from "../../core/types/dto/LanguageDTO"
import ProposalDTO from "../../core/types/dto/ProposalDTO"
import SnippetDTO from "../../core/types/dto/SnippetDTO"
import TaskDTO from "../../core/types/dto/TaskDTO"
import TaskGroupDTO from "../../core/types/dto/TaskGroupDTO"
import { ENDPOINTS } from "../../core/params/Url"
import createClient from "./Client"
import IClient from "../IClient"
import EitherMsg from "../../core/types/EitherMsg"
import ProposalCreateDTO from "../../core/types/dto/ProposalCreateDTO"


class HttpClient implements IClient {
    private client: AxiosInstance
    constructor() {
        this.client = createClient();
    }

    getSnippets(lang1: number, lang2: number, taskGroup: number): Promise<EitherMsg<SnippetDTO[]>> {
        return this.makeGetRequest<SnippetDTO[]>(`${ENDPOINTS.snippets.get}/${taskGroup}/${lang1}/${lang2}`)
    }

    getLanguages(): Promise<EitherMsg<LanguageGroupedDTO[]>> {
        return this.makeGetRequest<LanguageGroupedDTO[]>(`${ENDPOINTS.languages.getGrouped}`)
    }

    getLanguagesReq(): Promise<EitherMsg<LanguageDTO[]>> {
        return this.makeGetRequest<LanguageDTO[]>(`${ENDPOINTS.languages.get}`)
    }

    getTaskGroups(): Promise<EitherMsg<TaskGroupDTO[]>> {
        return this.makeGetRequest<TaskGroupDTO[]>(`${ENDPOINTS.taskGroups.get}`)
    }

    getLanguageGroups(): Promise<EitherMsg<LanguageGroupDTO[]>> {
        return this.makeGetRequest<LanguageGroupDTO[]>(`${ENDPOINTS.languageGroups.get}`)
    }

    getProposals(): Promise<EitherMsg<ProposalDTO[]>> {
        return this.makeGetRequest<ProposalDTO[]>(`${ENDPOINTS.proposals.get}`)
    }

    getTasks(tgId: number): Promise<EitherMsg<TaskDTO[]>> {
        return this.makeGetRequest<TaskDTO[]>(`${ENDPOINTS.tasks.get}/${tgId}`)
    }

    getAlternatives(langId: number, taskId: number): Promise<EitherMsg<AlternativeDTO[]>> {
        return this.makeGetRequest<AlternativeDTO[]>(`${ENDPOINTS.alternatives.get}/${langId}/${taskId}`)
    }

    getAdminCounts(): Promise<EitherMsg<string>> {
        return this.makeGetRequest<string>(`${ENDPOINTS.adminCounts.get}`)
    }

    proposalCreate(proposal: string, langId: number, taskId: number): Promise<string> {
        const payload = {langId, taskId, content: proposal, }
        return this.makePostRequest<ProposalCreateDTO>(`${ENDPOINTS.proposal.post}`, payload)
    }

    proposalApprove(snId: number): Promise<string> {
        return this.makePostRequestNoPayload(`${ENDPOINTS.snippet.approve}/${snId}`)
    }

    snippetMarkPrimary(snId: number): Promise<string> {
        return this.makePostRequestNoPayload(`${ENDPOINTS.snippet.markPrimary}/${snId}`)
    }
    

    private async makeGetRequest<T>(url: string): Promise<EitherMsg<T>> {
        try {
            const r = await this.client.get<T>(url)
            if (r.data) {
                return { isOK: true, value: r.data, }
            } else {
                return { isOK: false, errMsg: "Error: empty result", }
            }
        } catch(e: any) {
            return { isOK: false, errMsg: e.toString() }
        }
    }

    private async makePostRequest<T>(url: string, payload: T): Promise<string> {
        try {
            const r = await this.client.post<string>(url, payload)
            if (r.data && r.data === "OK") {
                return ""
            } else {
                return "Error"
            }
        } catch(e: any) {
            return "Error"
        }
    }

    private async makePostRequestNoPayload(url: string): Promise<string> {
        try {
            const r = await this.client.post<string>(url)
            if (r.data && r.data === "OK") {
                return ""
            } else {
                return "Error"
            }
        } catch(e: any) {
            return "Error"
        }
    }
}
export default HttpClient