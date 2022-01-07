import { AxiosInstance } from "axios"
import createClient from "./HttpConfig"
import IClient from "../IClient"
import EitherMsg from "../../core/types/EitherMsg"
import { SignInAdminDTO, SignInDTO, SignInSuccessDTO } from "../../core/types/dto/AuthDTO"
import { ProfileDTO, StatsDTO } from "../../core/types/dto/UserDTO"
import { LanguageGroupedDTO, LanguageDTO, TaskGroupDTO, LanguageGroupDTO, TaskDTO, PostResponseDTO } from "../../core/types/dto/AuxDTO"
import { SnippetDTO, ProposalDTO, AlternativesDTO, ProposalCreateDTO } from "../../core/types/dto/SnippetDTO"


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

    getAlternatives(tlId: number): Promise<EitherMsg<AlternativesDTO[]>> {
        return this.makeGetRequest<AlternativesDTO[]>(`/alternatives/${tlId}`)
    }

    getAdminStats(): Promise<EitherMsg<StatsDTO[]>> {
        return this.makeGetRequest<StatsDTO[]>(`/admin/stats`)
    }

    proposalCreate(proposal: string, langId: number, taskId: number, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        const payload = {langId, taskId, content: proposal, }
        return this.makePostRequestForString<ProposalCreateDTO>(`/proposal/create`, payload, headers)
    }

    proposalApprove(snId: number, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.makePostRequestNoPayload(`/snippet/approve/${snId}`, headers)
    }

    proposalDecline(snId: number, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.makePostRequestNoPayload(`/snippet/decline/${snId}`, headers)        
    }

    snippetMarkPrimary(snId: number, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.makePostRequestNoPayload(`/snippet/markPrimary/${snId}`, headers)
    }

    languageCU(headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.makePostRequestNoPayload(`/language/cu`, headers)
    }

    languageGroupCU(headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.makePostRequestNoPayload(`languageGroup/cu`, headers)
    }

    taskCU(headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.makePostRequestNoPayload(`/task/cu`, headers)
    }

    taskGroupCU(headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.makePostRequestNoPayload(`/taskGroup/cu`, headers)
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

    userProfile(headers: SignInSuccessDTO): Promise<EitherMsg<ProfileDTO[]>> {
        return this.makeGetRequest("/user/profile", headers)
    }


    private async makeGetRequest<T>(url: string, headers?: SignInSuccessDTO): Promise<EitherMsg<T>> {
        try {
            const r = headers ? await this.client.get<T>(url, { headers: { userId: headers.userId.toString(), accessToken: headers.accessToken, },}) 
                              : await this.client.get<T>(url);
            if (r.data) {
                return { isOK: true, value: r.data, }
            } else {
                return { isOK: false, errMsg: "Error: empty result", }
            }
        } catch(e: any) {
            return { isOK: false, errMsg: e.toString() }
        }
    }

    private async makePostRequestForString<T>(url: string, payload: T, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        try {
            const r = await this.client.post<PostResponseDTO>(url, payload, 
                { headers: { userId: headers.userId.toString(), accessToken: headers.accessToken, }, }
            )
            if (r.data && r.data.status === "OK") {
                return r.data
            } else {
                return {status: "Unknown error"}
            }
        } catch(e: any) {
            return {status: e}
        }
    }

    private async makePostRequestNoPayload(url: string, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        try {
            const r = await this.client.post<PostResponseDTO>(url, undefined, 
                                                    { headers: { userId: headers.userId.toString(), accessToken: headers.accessToken, }, })
            if (r.data && r.data.status === "OK") {
                return r.data
            } else {
                return {status: "Unknown error"}
            }
        } catch(e: any) {
            return {status: e}
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