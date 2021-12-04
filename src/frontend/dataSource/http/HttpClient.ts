import { AxiosInstance } from "axios"
import AlternativeDTO from "../../../common/dto/AlternativeDTO"
import LanguageGroupedDTO from "../../../common/dto/LanguageGroupedDTO"
import LanguageGroupDTO from "../../../common/dto/LanguageGroupDTO"
import LanguageDTO from "../../../common/dto/LanguageDTO"
import ProposalDTO from "../../../common/dto/ProposalDTO"
import SnippetDTO from "../../../common/dto/SnippetDTO"
import TaskDTO from "../../../common/dto/TaskDTO"
import TaskGroupDTO from "../../../common/dto/TaskGroupDTO"
import { ENDPOINTS } from "../../../common/web/Url"
import createClient from "../../Client"
import IClient from "../../interfaces/IClient"
import EitherMsg from "../../types/EitherMsg"
import ProposalCreateDTO from "../../../common/dto/ProposalCreateDTO"


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

    postProposal(proposal: string, langId: number, taskId: number): Promise<string> {
        const payload = {langId, taskId, content: proposal, }
        return this.makePostRequest<ProposalCreateDTO>(`${ENDPOINTS.proposal.post}`, payload)
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
}
export default HttpClient