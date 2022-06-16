import { AxiosInstance } from "axios"
import createClient from "./HttpConfig"
import IClient from "../IClient"
import ServerResponse from "../../core/types/ServerResponse"
import { SignInAdminDTO, SignInDTO, ChangePwAdminDTO, ChangePwDTO, HandshakeDTO, RegisterDTO, HandshakeResponseDTO, SignInResponseDTO } from "../../core/types/dto/AuthDTO"
import { CommentCUDTO, CommentDTO, ProfileDTO, StatsDTO, VoteDTO } from "../../core/types/dto/UserDTO"
import { LanguageDTO, TaskGroupDTO,  TaskDTO, PostResponseDTO, LanguageCUDTO, TaskCUDTO, TaskGroupCUDTO } from "../../core/types/dto/AuxDTO"
import { SnippetDTO, ProposalDTO, AlternativesDTO, ProposalCreateDTO, ProposalUpdateDTO, BareSnippetDTO } from "../../core/types/dto/SnippetDTO"
import ServerEither from "../../core/types/ServerEither"


class HttpClient implements IClient {
    private client: AxiosInstance
    constructor() {
        this.client = createClient();
    }

    snippetsGet(taskGroup: number, lang1: number, lang2: number): Promise<ServerResponse<SnippetDTO[]>> {
        return this.getRequestNoCreds<SnippetDTO[]>(`/snippets/${taskGroup}/${lang1}/${lang2}`)
    }

    snippetsByCode(taskGroup: string, lang1: string, lang2: string): Promise<ServerResponse<SnippetDTO[]>> {
        return this.getRequestNoCreds<SnippetDTO[]>(`/snippets/byCode?task=${taskGroup}&lang1=${lang1}&lang2=${lang2}`)
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

    alternativesGet(tlId: number): Promise<ServerResponse<ServerEither<AlternativesDTO>>> {
        return this.getRequestNoCreds<ServerEither<AlternativesDTO>>(`/alternatives/${tlId}`)
    }

    alternativesForUserGet(tlId: number, userId: number): Promise<ServerResponse<ServerEither<AlternativesDTO>>> {
        return this.getRequestNoCreds<ServerEither<AlternativesDTO>>(`/alternativesForUser/${tlId}/${userId}`)
    }

    proposalCreate(dto: ProposalCreateDTO, mbUserId: number): Promise<PostResponseDTO> {
        return this.postRequest<ProposalCreateDTO>(`/secure/proposal/create`, dto, mbUserId)
    }

    proposalGet(snId: number): Promise<ServerResponse<BareSnippetDTO[]>> {
        return this.getRequestNoCreds<BareSnippetDTO[]>(`/snippet/${snId}`)
    }

    proposalUpdate(dto: ProposalUpdateDTO, mbUserId: number): Promise<PostResponseDTO> {
        return this.postRequest<ProposalUpdateDTO>(`/admin/proposal/update`, dto, mbUserId)
    }

    proposalApprove(snId: number, mbUserId: number): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/admin/snippet/approve/${snId}`, mbUserId)
    }

    proposalDecline(snId: number, mbUserId: number): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/admin/snippet/decline/${snId}`, mbUserId)
    }

    snippetMarkPrimary(tlId: number, snId: number, mbUserId: number): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/admin/snippet/markPrimary/${tlId}/${snId}`, mbUserId)
    }

    commentsGet(snId: number): Promise<ServerResponse<CommentDTO[]>> {
        return this.getRequestNoCreds<CommentDTO[]>(`/comments/${snId}`)
    }

    commentCreate(dto: CommentCUDTO, mbUserId: number): Promise<PostResponseDTO> {
        return this.postRequest("/secure/comment/cu", dto, mbUserId)
    }

    languageCU(dto: LanguageCUDTO, mbUserId: number): Promise<PostResponseDTO> {
        return this.postRequest(`/admin/language/cu`, dto, mbUserId)
    }

    taskCU(dto: TaskCUDTO, mbUserId: number): Promise<PostResponseDTO> {
        return this.postRequest(`/admin/task/cu`, dto, mbUserId)
    }

    taskGet(taskId: number): Promise<ServerResponse<TaskDTO[]>> {
        return this.getRequestNoCreds(`/admin/task/${taskId}`)
    }

    taskGroupCU(dto: TaskGroupCUDTO, mbUserId: number): Promise<PostResponseDTO> {
        return this.postRequest(`/admin/taskGroup/cu`, dto, mbUserId)
    }

    userRegister(dto: RegisterDTO): Promise<ServerResponse<ServerEither<HandshakeResponseDTO>>> {
        return this.postRequestNombUserId("/user/register", dto)
    }

    userHandshake(dto: HandshakeDTO): Promise<ServerResponse<ServerEither<HandshakeResponseDTO>>> {
        return this.postRequestNombUserId("/user/handshake", dto)
    }

    userSignIn(dto: SignInDTO): Promise<ServerResponse<ServerEither<SignInResponseDTO>>> {
        return this.postRequestNombUserId("/user/signIn", dto)
    }

    userVote(dto: VoteDTO, mbUserId: number): Promise<PostResponseDTO> {
        return this.postRequest("/secure/user/vote", dto, mbUserId)
    }

    userSignInAdmin(dto: SignInAdminDTO): Promise<ServerResponse<ServerEither<number>>> {
        return this.postRequestNombUserId("/user/signInAdmin", dto)
    }

    userProfile(mbUserId: number): Promise<ServerResponse<ProfileDTO[]>> {
        return this.getRequest("/secure/user/profile", mbUserId)
    }

    userChangePw(dto: ChangePwDTO): Promise<ServerResponse<ServerEither<number>>> {
        return this.postRequestNombUserId("/secure/user/changePw", dto)
    }

    userChangeAdminPw(dto: ChangePwAdminDTO): Promise<ServerResponse<ServerEither<number>>> {
        return this.postRequestNombUserId("/admin/changeAdminPw", dto)
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

    private async getRequest<T>(url: string, userId: number): Promise<ServerResponse<T>> {
        // TODO handle error responses
        try {
            const r = await this.client.get<T>(
                    url, { headers: { userId: userId.toString() }, withCredentials: true, }
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

    private async getRequestNoCreds<T>(url: string, mbUserId?: number): Promise<ServerResponse<T>> {
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
    private async postRequest<T>(url: string, payload: T, userId: number): Promise<PostResponseDTO> {
        try {
            const r = await this.client.post<PostResponseDTO>(url, payload,
                { headers: { userId: userId.toString() }, withCredentials: true, }
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

    private async postRequestNoPayload(url: string, userId: number): Promise<PostResponseDTO> {
        try {
            const r = await this.client.post<PostResponseDTO>(url, undefined,
                                                    { headers: { userId: userId.toString() }, withCredentials: true, })
            if (r.data && r.data.status === "OK") {
                return r.data
            } else {
                return {status: "Unknown error"}
            }
        } catch(e: any) {
            return {status: e}
        }
    }

    private async postRequestWithResult<T, U>(url: string, payload: T, userId: number): Promise<ServerResponse<U>> {
        try {
            const r = await this.client.post<U>(
                url, payload, { headers: { userId: userId.toString() }, withCredentials: true,
            })
            return {isOK: true, value: r.data, }
        } catch(e: any) {
            return {isOK: false, errMsg: e, }
        }
    }

    private async postRequestNombUserId<T, U>(url: string, payload: T): Promise<ServerResponse<U>> {
        try {
            const r = await this.client.post<U>(url, payload)
            return {isOK: true, value: r.data, }
        } catch(e: any) {
            return {isOK: false, errMsg: e, }
        }
    }
    private async postRequestNombUserIdNoWrap<T, U>(url: string, payload: T): Promise<ServerResponse<U>> {
        try {
            const r = await this.client.post<U>(url, payload)
            return {isOK: true, value: r.data, }
        } catch(e: any) {
            return {isOK: false, errMsg: e, }
        }
    }
}

export default HttpClient
