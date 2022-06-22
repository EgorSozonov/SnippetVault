import { AxiosInstance } from "axios"
import createClient from "./HttpConfig"
import IClient from "../IClient"
import ServerResponse from "../../core/types/ServerResponse"
import { SignInDTO, ChangePwDTO, HandshakeDTO, RegisterDTO, HandshakeResponseDTO, SignInResponseDTO } from "../../core/types/dto/AuthDTO"
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

    alternativesForUserGet(tlId: number, userName: string): Promise<ServerResponse<ServerEither<AlternativesDTO>>> {
        return this.getRequestNoCreds<ServerEither<AlternativesDTO>>(`/alternativesForUser/${tlId}/${userName}`)
    }

    proposalCreate(dto: ProposalCreateDTO, userName: string): Promise<PostResponseDTO> {
        return this.postRequest<ProposalCreateDTO>(`/secure/proposal/create`, dto, userName)
    }

    proposalGet(snId: number): Promise<ServerResponse<BareSnippetDTO>> {
        return this.getRequestNoCreds<BareSnippetDTO>(`/snippet/${snId}`)
    }

    proposalUpdate(dto: ProposalUpdateDTO, userName: string): Promise<PostResponseDTO> {
        return this.postRequest<ProposalUpdateDTO>(`/admin/proposal/update`, dto, userName)
    }

    proposalApprove(snId: number, userName: string): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/admin/snippet/approve/${snId}`, userName)
    }

    proposalDecline(snId: number, userName: string): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/admin/snippet/decline/${snId}`, userName)
    }

    snippetMarkPrimary(tlId: number, snId: number, userName: string): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/admin/snippet/markPrimary/${tlId}/${snId}`, userName)
    }

    commentsGet(snId: number): Promise<ServerResponse<CommentDTO[]>> {
        return this.getRequestNoCreds<CommentDTO[]>(`/comments/${snId}`)
    }

    commentCreate(dto: CommentCUDTO, userName: string): Promise<PostResponseDTO> {
        return this.postRequest("/secure/comment/cu", dto, userName)
    }

    languageCU(dto: LanguageCUDTO, userName: string): Promise<PostResponseDTO> {
        return this.postRequest(`/admin/language/cu`, dto, userName)
    }

    taskCU(dto: TaskCUDTO, userName: string): Promise<PostResponseDTO> {
        return this.postRequest(`/admin/task/cu`, dto, userName)
    }

    taskGet(taskId: number): Promise<ServerResponse<TaskDTO[]>> {
        return this.getRequestNoCreds(`/admin/task/${taskId}`)
    }

    taskGroupCU(dto: TaskGroupCUDTO, userName: string): Promise<PostResponseDTO> {
        return this.postRequest(`/admin/taskGroup/cu`, dto, userName)
    }

    userRegister(dto: RegisterDTO): Promise<ServerResponse<ServerEither<HandshakeResponseDTO>>> {
        return this.postRequestNouserName("/user/register", dto)
    }

    userHandshake(dto: HandshakeDTO): Promise<ServerResponse<ServerEither<HandshakeResponseDTO>>> {
        return this.postRequestNouserName("/user/handshake", dto)
    }

    userHandshakeAdmin(dto: HandshakeDTO): Promise<ServerResponse<ServerEither<HandshakeResponseDTO>>> {
        return this.postRequestNouserName("/user/handshakeAdmin", dto)
    }

    userSignIn(dto: SignInDTO): Promise<ServerResponse<ServerEither<SignInResponseDTO>>> {
        return this.postRequestNouserName("/user/signIn", dto)
    }

    userVote(dto: VoteDTO, userName: string): Promise<PostResponseDTO> {
        return this.postRequest("/secure/user/vote", dto, userName)
    }

    userProfile(userName: string): Promise<ServerResponse<ProfileDTO>> {
        return this.getRequest("/secure/user/profile", userName)
    }

    userChangePw(dto: ChangePwDTO, userName: string): Promise<ServerResponse<ServerEither<SignInResponseDTO>>> {
        return this.postRequestWithResult("/secure/user/changePw", dto, userName)
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
        return this.getRequestNoCreds<StatsDTO[]>(`/adminStats`)
    }

    private async getRequest<T>(url: string, userName: string): Promise<ServerResponse<T>> {

        try {

            const r = await this.client.get<T>(
                    url, { headers: { userName: userName.toString() }, withCredentials: true, }
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

    private async getRequestNoCreds<T>(url: string, userName?: number): Promise<ServerResponse<T>> {
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

    private async postRequest<T>(url: string, payload: T, userName: string): Promise<PostResponseDTO> {
        try {
            const r = await this.client.post(url, payload,
                { headers: { userName: userName.toString() }, withCredentials: true, }
            )
            if (r.status === 200) {
                return {status: "OK"}
            } else {
                return {status: "Unknown error"}
            }
        } catch(e: any) {
            console.log("en exc he")
            return {status: e}
        }
    }

    private async postRequestNoPayload(url: string, userName: string): Promise<PostResponseDTO> {
        try {
            const r = await this.client.post(url, undefined,
                                                    { headers: { userName: userName.toString() }, withCredentials: true, })
            if (r.status === 200) {
                return {status: "OK"}
            } else {
                return {status: "Unknown error"}
            }
        } catch(e: any) {
            return {status: e}
        }
    }

    private async postRequestWithResult<T, U>(url: string, payload: T, userName: string): Promise<ServerResponse<U>> {
        try {
            const r = await this.client.post<U>(
                url, payload, { headers: { userName: userName.toString() }, withCredentials: true,
            })
            return {isOK: true, value: r.data, }
        } catch(e: any) {
            return {isOK: false, errMsg: e, }
        }
    }

    private async postRequestNouserName<T, U>(url: string, payload: T): Promise<ServerResponse<U>> {
        try {
            const r = await this.client.post<U>(url, payload)
            return { isOK: true, value: r.data, }
        } catch(e: any) {
            return {isOK: false, errMsg: e, }
        }
    }
    private async postRequestNouserNameNoWrap<T, U>(url: string, payload: T): Promise<ServerResponse<U>> {
        try {
            const r = await this.client.post<U>(url, payload)
            return {isOK: true, value: r.data, }
        } catch(e: any) {
            return {isOK: false, errMsg: e, }
        }
    }
}

export default HttpClient
