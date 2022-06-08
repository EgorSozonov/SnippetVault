import { AxiosInstance } from "axios"
import createClient from "./HttpConfig"
import IClient from "../IClient"
import ServerResponse from "../../core/types/ServerResponse"
import { SignInAdminDTO, SignInDTO, SignInSuccessDTO as AuthorizeDTO, ChangePwAdminDTO, ChangePwDTO, HandshakeDTO, RegisterDTO, HandshakeResponseDTO, SignInResponseDTO } from "../../core/types/dto/AuthDTO"
import { CommentCUDTO, CommentDTO, ProfileDTO, StatsDTO, VoteDTO } from "../../core/types/dto/UserDTO"
import { LanguageDTO, TaskGroupDTO,  TaskDTO, PostResponseDTO, LanguageCUDTO, TaskCUDTO, TaskGroupCUDTO } from "../../core/types/dto/AuxDTO"
import { SnippetDTO, ProposalDTO, AlternativesDTO, ProposalCreateDTO, ProposalUpdateDTO, BareSnippetDTO } from "../../core/types/dto/SnippetDTO"


class HttpClient implements IClient {
    private client: AxiosInstance
    constructor() {
        this.client = createClient();
    }

    snippetsGet(taskGroup: number, lang1: number, lang2: number): Promise<ServerResponse<SnippetDTO[]>> {
        return this.getRequestNoCreds<SnippetDTO[]>(`/snippets/${taskGroup}/${lang1}/${lang2}`)
    }

    snippetsByCode(taskGroup: string, lang1: string, lang2: string): Promise<ServerResponse<SnippetDTO[]>> {
        return this.getRequestNoCreds<SnippetDTO[]>(`/snippets/byCode?taskGroup=${taskGroup}&lang1=${lang1}&lang2=${lang2}`)
    }

    languagesGet(): Promise<ServerResponse<LanguageDTO[]>> {
        return this.getRequestNoCreds<LanguageDTO[]>(`/languages`)
    }

    taskGroupsGet(): Promise<ServerResponse<TaskGroupDTO[]>> {
        return this.getRequestNoCreds<TaskGroupDTO[]>(`/taskGroups`)
    }

    proposalsGet(): Promise<ServerResponse<ProposalDTO[]>> {
        return this.getRequestNoCreds<ProposalDTO[]>(`/proposals`)
    }

    alternativesGet(tlId: number): Promise<ServerResponse<AlternativesDTO[]>> {
        return this.getRequestNoCreds<AlternativesDTO[]>(`/alternatives/${tlId}`)
    }

    alternativesForUserGet(tlId: number, userId: number): Promise<ServerResponse<AlternativesDTO[]>> {
        return this.getRequestNoCreds<AlternativesDTO[]>(`/alternativesForUser/${tlId}/${userId}`)
    }

    proposalCreate(dto: ProposalCreateDTO, headers: AuthorizeDTO): Promise<PostResponseDTO> {
        return this.postRequest<ProposalCreateDTO>(`/secure/proposal/create`, dto, headers)
    }

    proposalGet(snId: number): Promise<ServerResponse<BareSnippetDTO[]>> {
        return this.getRequestNoCreds<BareSnippetDTO[]>(`/snippet/${snId}`)
    }

    proposalUpdate(dto: ProposalUpdateDTO, headers: AuthorizeDTO): Promise<PostResponseDTO> {
        return this.postRequest<ProposalUpdateDTO>(`/admin/proposal/update`, dto, headers)
    }

    proposalApprove(snId: number, headers: AuthorizeDTO): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/admin/snippet/approve/${snId}`, headers)
    }

    proposalDecline(snId: number, headers: AuthorizeDTO): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/admin/snippet/decline/${snId}`, headers)
    }

    snippetMarkPrimary(tlId: number, snId: number, headers: AuthorizeDTO): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/admin/snippet/markPrimary/${tlId}/${snId}`, headers)
    }

    commentsGet(snId: number): Promise<ServerResponse<CommentDTO[]>> {
        return this.getRequestNoCreds<CommentDTO[]>(`/comments/${snId}`)
    }

    commentCreate(dto: CommentCUDTO, headers: AuthorizeDTO): Promise<PostResponseDTO> {
        return this.postRequest("/secure/comment/cu", dto, headers)
    }

    languageCU(dto: LanguageCUDTO, headers: AuthorizeDTO): Promise<PostResponseDTO> {
        return this.postRequest(`/admin/language/cu`, dto, headers)
    }

    taskCU(dto: TaskCUDTO, headers: AuthorizeDTO): Promise<PostResponseDTO> {
        return this.postRequest(`/admin/task/cu`, dto, headers)
    }

    taskGet(taskId: number): Promise<ServerResponse<TaskDTO[]>> {
        return this.getRequestNoCreds(`/admin/task/${taskId}`)
    }

    taskGroupCU(dto: TaskGroupCUDTO, headers: AuthorizeDTO): Promise<PostResponseDTO> {
        return this.postRequest(`/admin/taskGroup/cu`, dto, headers)
    }

    userRegister(dto: RegisterDTO): Promise<ServerResponse<HandshakeResponseDTO>> {
        return this.postRequestNoHeaders("/user/register", dto)
    }

    userHandshake(dto: HandshakeDTO): Promise<ServerResponse<HandshakeResponseDTO>> {
        return this.postRequestNoHeaders("/user/handshake", dto)
    }

    userSignIn(dto: SignInDTO): Promise<ServerResponse<SignInResponseDTO>> {
        return this.postRequestNoHeaders("/user/signIn", dto)
    }

    userVote(dto: VoteDTO, headers: AuthorizeDTO): Promise<PostResponseDTO> {
        return this.postRequest("/secure/user/vote", dto, headers)
    }

    userSignInAdmin(dto: SignInAdminDTO): Promise<ServerResponse<AuthorizeDTO[]>> {
        return this.postRequestNoHeaders("/user/signInAdmin", dto)
    }

    userProfile(headers: AuthorizeDTO): Promise<ServerResponse<ProfileDTO[]>> {
        return this.getRequest("/secure/user/profile", headers)
    }

    userChangePw(dto: ChangePwDTO, headers: AuthorizeDTO): Promise<ServerResponse<AuthorizeDTO[]>> {
        return this.postRequestWithResult("/secure/user/changePw", dto, headers)
    }

    userChangeAdminPw(dto: ChangePwAdminDTO, headers: AuthorizeDTO): Promise<ServerResponse<AuthorizeDTO[]>> {
        return this.postRequestWithResult("/admin/changeAdminPw", dto, headers)
    }

    // Admin

    tasksAll(): Promise<ServerResponse<TaskCUDTO[]>> {
        return this.getRequestNoCreds<TaskCUDTO[]>(`/task/all`)
    }

    taskGroupsAll(): Promise<ServerResponse<TaskGroupCUDTO[]>> {
        return this.getRequestNoCreds<TaskGroupCUDTO[]>(`/taskGroup/all`)
    }

    languagesAll(): Promise<ServerResponse<LanguageCUDTO[]>> {
        return this.getRequestNoCreds<LanguageCUDTO[]>(`/language/all`)
    }

    adminStatsGet(): Promise<ServerResponse<StatsDTO[]>> {
        return this.getRequestNoCreds<StatsDTO[]>(`/admin/stats`)
    }

    private async getRequest<T>(url: string, headers: AuthorizeDTO): Promise<ServerResponse<T>> {
        // TODO handle error responses
        try {
            const r = await this.client.get<T>(
                    url, { headers: { userId: headers.userId.toString() }, withCredentials: true, }
                );
            if (r.data) {
                return { isOK: true, value: r.data, }
            } else {
                return { isOK: false, errMsg: "Error: empty result", }
            }
        } catch(e: any) {
            return { isOK: false, errMsg: e.toString() }
        }
    }

    private async getRequestNoCreds<T>(url: string, headers?: AuthorizeDTO): Promise<ServerResponse<T>> {
        try {
            const r = await this.client.get<T>(url);
            if (r.data) {
                return { isOK: true, value: r.data, }
            } else {
                return { isOK: false, errMsg: "Error: empty result", }
            }
        } catch(e: any) {
            return { isOK: false, errMsg: e.toString() }
        }
    }
    private async postRequest<T>(url: string, payload: T, headers: AuthorizeDTO): Promise<PostResponseDTO> {
        try {
            const r = await this.client.post<PostResponseDTO>(url, payload,
                { headers: { userId: headers.userId.toString() }, withCredentials: true, }
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

    private async postRequestNoPayload(url: string, headers: AuthorizeDTO): Promise<PostResponseDTO> {
        try {
            const r = await this.client.post<PostResponseDTO>(url, undefined,
                                                    { headers: { userId: headers.userId.toString() }, withCredentials: true, })
            if (r.data && r.data.status === "OK") {
                return r.data
            } else {
                return {status: "Unknown error"}
            }
        } catch(e: any) {
            return {status: e}
        }
    }

    private async postRequestWithResult<T, U>(url: string, payload: T, headers: AuthorizeDTO): Promise<ServerResponse<U>> {
        try {
            const r = await this.client.post<U>(
                url, payload, { headers: { userId: headers.userId.toString() }, withCredentials: true,
            })
            return {isOK: true, value: r.data, }
        } catch(e: any) {
            return {isOK: false, errMsg: e, }
        }
    }

    private async postRequestNoHeaders<T, U>(url: string, payload: T): Promise<ServerResponse<U>> {
        try {
            const r = await this.client.post<U>(url, payload)
            return {isOK: true, value: r.data, }
        } catch(e: any) {
            return {isOK: false, errMsg: e, }
        }
    }
    private async postRequestNoHeadersNoWrap<T, U>(url: string, payload: T): Promise<ServerResponse<U>> {
        try {
            const r = await this.client.post<U>(url, payload)
            return {isOK: true, value: r.data, }
        } catch(e: any) {
            return {isOK: false, errMsg: e, }
        }
    }
}

export default HttpClient
