import { AxiosInstance } from "axios"
import AlternativeDTO from "../../../common/dto/AlternativeDTO"
import LanguageDTO from "../../../common/dto/LanguageDTO"
import LanguageGroupDTO from "../../../common/dto/LanguageGroupDTO"
import ProposalDTO from "../../../common/dto/ProposalDTO"
import SnippetDTO from "../../../common/dto/SnippetDTO"
import TaskDTO from "../../../common/dto/TaskDTO"
import TaskGroupDTO from "../../../common/dto/TaskGroupDTO"
import { ENDPOINTS } from "../../../common/web/Url"
import createClient from "../../Client"
import IClient from "../../interfaces/IClient"
import EitherMsg from "../../types/EitherMsg"


class HttpClient implements IClient {
    constructor(private client: AxiosInstance) {
        client = createClient();
    }

    getSnippets(lang1: number, lang2: number, taskGroup: number): Promise<EitherMsg<SnippetDTO[]>> {
        return this.makeGetRequest<SnippetDTO[]>(`get/${ENDPOINTS.get.snippet}/${lang1}/${lang2}/${taskGroup}`)
    }

    getLanguages(): Promise<EitherMsg<LanguageDTO[]>> {
        return this.makeGetRequest<LanguageDTO[]>(`get/${ENDPOINTS.get.language}`)
    }

    getTaskGroups(): Promise<EitherMsg<TaskGroupDTO[]>> {
        return this.makeGetRequest<TaskGroupDTO[]>(`get/${ENDPOINTS.get.taskGroup}`)
    }

    getLanguageGroups(): Promise<EitherMsg<LanguageGroupDTO[]>> {
        return this.makeGetRequest<LanguageGroupDTO[]>(`get/${ENDPOINTS.get.languageGroup}`)
    }

    getProposals(): Promise<EitherMsg<ProposalDTO[]>> {
        return this.makeGetRequest<ProposalDTO[]>(`get/${ENDPOINTS.get.proposal}`)
    }

    getTasks(tgId: number): Promise<EitherMsg<TaskDTO[]>> {
        return this.makeGetRequest<TaskDTO[]>(`get/${ENDPOINTS.get.task}/${tgId}`)
    }

    getAlternatives(langId: number, taskId: number): Promise<EitherMsg<AlternativeDTO[]>> {
        return this.makeGetRequest<AlternativeDTO[]>(`get/${ENDPOINTS.get.alternative}/${langId}/${taskId}`)
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
}
export default HttpClient