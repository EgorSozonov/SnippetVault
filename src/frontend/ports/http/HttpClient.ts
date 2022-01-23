import { AxiosInstance } from "axios"
import createClient from "./HttpConfig"
import IClient from "../IClient"
import EitherMsg from "../../core/types/EitherMsg"
import { SignInAdminDTO, SignInDTO, SignInSuccessDTO, ChangePwAdminDTO, ChangePwDTO } from "../../core/components/dto/AuthDTO"
import { CommentCUDTO, CommentDTO, ProfileDTO, StatsDTO, VoteDTO } from "../../core/components/dto/UserDTO"
import { LanguageGroupedDTO, LanguageDTO, TaskGroupDTO, LanguageGroupDTO, TaskDTO, PostResponseDTO } from "../../core/components/dto/AuxDTO"
import { SnippetDTO, ProposalDTO, AlternativesDTO, ProposalCreateDTO, ProposalUpdateDTO, BareSnippetDTO } from "../../core/components/dto/SnippetDTO"


class HttpClient implements IClient {
    private client: AxiosInstance
    constructor() {
        this.client = createClient();
    }

    snippetsGet(taskGroup: number, lang1: number, lang2: number): Promise<EitherMsg<SnippetDTO[]>> {
        return this.getRequest<SnippetDTO[]>(`/snippets/${taskGroup}/${lang1}/${lang2}`)
    }

    snippetsByCode(taskGroup: string, lang1: string, lang2: string): Promise<EitherMsg<SnippetDTO[]>> {
        return this.getRequest<SnippetDTO[]>(`/snippets/byCode?taskGroup=${taskGroup}&lang1=${lang1}&lang2=${lang2}`)
    }

    languagesGet(): Promise<EitherMsg<LanguageGroupedDTO[]>> {
        return this.getRequest<LanguageGroupedDTO[]>(`/languages/getGrouped`)
    }

    languagesReqGet(): Promise<EitherMsg<LanguageDTO[]>> {
        return this.getRequest<LanguageDTO[]>(`/languages/get`)
    }

    taskGroupsGet(): Promise<EitherMsg<TaskGroupDTO[]>> {
        return this.getRequest<TaskGroupDTO[]>(`/taskGroups`)
    }

    languageGroupsGet(): Promise<EitherMsg<LanguageGroupDTO[]>> {
        return this.getRequest<LanguageGroupDTO[]>(`/languageGroups`)
    }

    proposalsGet(): Promise<EitherMsg<ProposalDTO[]>> {
        return this.getRequest<ProposalDTO[]>(`/proposals`)
    }

    alternativesGet(tlId: number): Promise<EitherMsg<AlternativesDTO[]>> {
        return this.getRequest<AlternativesDTO[]>(`/alternatives/${tlId}`)
    }

    alternativesForUserGet(tlId: number, userId: number): Promise<EitherMsg<AlternativesDTO[]>> {
        return this.getRequest<AlternativesDTO[]>(`/alternativesForUser/${tlId}/${userId}`)
    }

    proposalCreate(proposal: string, langId: number, taskId: number, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        const payload: ProposalCreateDTO = {langId, taskId, content: proposal, }
        return this.postRequest<ProposalCreateDTO>(`/proposal/create`, payload, headers)
    }

    proposalGet(snId: number): Promise<EitherMsg<BareSnippetDTO[]>> {
        return this.getRequest<BareSnippetDTO[]>(`/snippet/${snId}`)
    }

    proposalUpdate(dto: ProposalUpdateDTO, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequest<ProposalUpdateDTO>(`/proposal/update`, dto, headers)
    }

    proposalApprove(snId: number, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/snippet/approve/${snId}`, headers)
    }

    proposalDecline(snId: number, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/snippet/decline/${snId}`, headers)        
    }

    snippetMarkPrimary(snId: number, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/snippet/markPrimary/${snId}`, headers)
    }

    commentsGet(snId: number): Promise<EitherMsg<CommentDTO[]>> {
        return this.getRequest<CommentDTO[]>(`/comments/${snId}`)
    }

    commentCreate(dto: CommentCUDTO, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequest("/comment/cu", dto, headers)
    }

    languageCU(headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/language/cu`, headers)
    }

    languageGroupCU(headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`languageGroup/cu`, headers)
    }

    taskCU(headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/task/cu`, headers)
    }

    taskFromTL(tlId: number): Promise<EitherMsg<TaskDTO[]>> {
        return this.getRequest(`/task/${tlId}`)
    }

    taskGroupCU(headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/taskGroup/cu`, headers)
    }

    userRegister(dto: SignInDTO): Promise<EitherMsg<SignInSuccessDTO[]>> {
        return this.postRequestNoHeaders("/user/register", dto)
    }

    userVote(dto: VoteDTO, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequest("/user/vote", dto, headers)
    }
    
    userSignIn(dto: SignInDTO): Promise<EitherMsg<SignInSuccessDTO[]>> {
        return this.postRequestNoHeaders("/user/signIn", dto)
    }

    userSignInAdmin(dto: SignInAdminDTO): Promise<EitherMsg<SignInSuccessDTO[]>> {
        return this.postRequestNoHeaders("/user/signInAdmin", dto)
    }

    userProfile(headers: SignInSuccessDTO): Promise<EitherMsg<ProfileDTO[]>> {
        return this.getRequest("/user/profile", headers)
    }

    userChangePw(dto: ChangePwDTO, headers: SignInSuccessDTO): Promise<EitherMsg<SignInSuccessDTO[]>> {
        return this.postRequestWithResult("/user/changePw", dto, headers)
    }

    userChangeAdminPw(dto: ChangePwAdminDTO, headers: SignInSuccessDTO): Promise<EitherMsg<SignInSuccessDTO[]>> {
        return this.postRequestWithResult("/user/changeAdminPw", dto, headers)
    }


    adminStatsGet(): Promise<EitherMsg<StatsDTO[]>> {
        return this.getRequest<StatsDTO[]>(`/admin/stats`)
    }

    private async getRequest<T>(url: string, headers?: SignInSuccessDTO): Promise<EitherMsg<T>> {
        try {
            const r = headers 
                ? await this.client.get<T>(
                    url, { headers: { userId: headers.userId.toString(), accessToken: headers.accessToken, },
                  }) 
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

    private async postRequest<T>(url: string, payload: T, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
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

    private async postRequestNoPayload(url: string, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
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

    private async postRequestWithResult<T, U>(url: string, payload: T, headers: SignInSuccessDTO): Promise<EitherMsg<U>> {
        try {
            const r = await this.client.post<U>(
                url, payload, { headers: { userId: headers.userId.toString(), accessToken: headers.accessToken, }, 
            })
            return {isOK: true, value: r.data, }            
        } catch(e: any) {
            return {isOK: false, errMsg: e, }
        }
    }

    private async postRequestNoHeaders<T, U>(url: string, payload: T): Promise<EitherMsg<U>> {
        try {
            const r = await this.client.post<U>(url, payload)
            return {isOK: true, value: r.data, }            
        } catch(e: any) {
            return {isOK: false, errMsg: e, }
        }
    }
}

export default HttpClient