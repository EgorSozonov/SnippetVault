import { AxiosInstance } from "axios"
import AlternativeDTO from "../../core/types/dto/AlternativeDTO"
import LanguageGroupedDTO from "../../core/types/dto/LanguageGroupedDTO"
import LanguageGroupDTO from "../../core/types/dto/LanguageGroupDTO"
import LanguageDTO from "../../core/types/dto/LanguageDTO"
import ProposalDTO from "../../core/types/dto/ProposalDTO"
import SnippetDTO from "../../core/types/dto/SnippetDTO"
import TaskDTO from "../../core/types/dto/TaskDTO"
import TaskGroupDTO from "../../core/types/dto/TaskGroupDTO"
import createClient from "./Client"
import IClient from "../IClient"
import EitherMsg from "../../core/types/EitherMsg"
import ProposalCreateDTO from "../../core/types/dto/ProposalCreateDTO"
import { SignInAdminDTO, SignInDTO, SignInSuccessDTO } from "../../core/types/dto/AuthDTO"


class HttpClient implements IClient {
    private client: AxiosInstance
    constructor() {
        this.client = createClient();
    }

    getSnippets(taskGroup: number, lang1: number, lang2: number): Promise<EitherMsg<SnippetDTO[]>> {
        return this.makeGetRequest<SnippetDTO[]>(`/snippets/${taskGroup}/${lang1}/${lang2}`)
    }

    getSnippetsByCode(taskGroup: string, lang1: string, lang2: string): Promise<EitherMsg<SnippetDTO[]>> {
        return this.makeGetRequest<SnippetDTO[]>(`/snippets/byCode?taskGroup=${taskGroup}&lang1=${lang1}&lang2=${lang2}`)
    }

    getLanguages(): Promise<EitherMsg<LanguageGroupedDTO[]>> {
        return this.makeGetRequest<LanguageGroupedDTO[]>(`/languages/getGrouped`)
    }

    getLanguagesReq(): Promise<EitherMsg<LanguageDTO[]>> {
        return this.makeGetRequest<LanguageDTO[]>(`/languages/get`)
    }

    getTaskGroups(): Promise<EitherMsg<TaskGroupDTO[]>> {
        return this.makeGetRequest<TaskGroupDTO[]>(`/taskGroups`)
    }

    getLanguageGroups(): Promise<EitherMsg<LanguageGroupDTO[]>> {
        return this.makeGetRequest<LanguageGroupDTO[]>(`/languageGroups`)
    }

    getProposals(): Promise<EitherMsg<ProposalDTO[]>> {
        return this.makeGetRequest<ProposalDTO[]>(`/proposals`)
    }

    getTasks(tgId: number): Promise<EitherMsg<TaskDTO[]>> {
        return this.makeGetRequest<TaskDTO[]>(`/tasks/${tgId}`)
    }

    getAlternatives(tlId: number): Promise<EitherMsg<AlternativeDTO[]>> {
        return this.makeGetRequest<AlternativeDTO[]>(`/alternatives/${tlId}`)
    }

    getAdminCounts(): Promise<EitherMsg<string>> {
        return this.makeGetRequest<string>(`/admin/counts`)
    }

    proposalCreate(proposal: string, langId: number, taskId: number): Promise<string> {
        const payload = {langId, taskId, content: proposal, }
        return this.makePostRequestForString<ProposalCreateDTO>(`/proposal/create`, payload)
    }

    proposalApprove(snId: number): Promise<string> {
        return this.makePostRequestNoPayload(`/snippet/approve/${snId}`)
    }

    snippetMarkPrimary(snId: number): Promise<string> {
        return this.makePostRequestNoPayload(`/snippet/markPrimary/${snId}`)
    }

    languageCU(): Promise<string> {
        // TODO 
        return this.makePostRequestNoPayload(`/language/cu`)
    }

    languageGroupCU(): Promise<string> {
        // TODO 
        return this.makePostRequestNoPayload(`languageGroup/cu`)
    }

    taskCU(): Promise<string> {
        // TODO 
        return this.makePostRequestNoPayload(`/task/cu`)
    }

    taskGroupCU(): Promise<string> {
        // TODO 
        return this.makePostRequestNoPayload(`/taskGroup/cu`)
    }

    userRegister(dto: SignInDTO): Promise<EitherMsg<SignInSuccessDTO[]>> {
        return this.makePostRequest("/user/register", dto)
    }
    
    userSignIn(dto: SignInDTO): Promise<EitherMsg<SignInSuccessDTO[]>> {
        return this.makePostRequest("/user/signIn", dto)
    }

    adminSignIn(dto: SignInAdminDTO): Promise<EitherMsg<SignInSuccessDTO[]>> {
        return this.makePostRequest("/user/signInAdmin", dto)
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

    private async makePostRequestForString<T>(url: string, payload: T): Promise<string> {
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

    private async makePostRequest<T, U>(url: string, payload: T): Promise<EitherMsg<U>> {
        try {
            const r = await this.client.post<U>(url, payload)
            return {isOK: true, value: r.data, }            
        } catch(e: any) {
            return {isOK: false, errMsg: e, }
        }
    }
}
export default HttpClient