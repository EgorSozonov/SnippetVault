import { AxiosInstance } from "axios"
import createClient from "./HttpConfig"
import IClient from "../IClient"
import EitherMsg from "../../core/types/EitherMsg"
import { SignInAdminDTO, SignInDTO, SignInSuccessDTO, ChangePwAdminDTO, ChangePwDTO, HandshakeDTO, RegisterDTO, HandshakeResponseDTO } from "../../core/types/dto/AuthDTO"
import { CommentCUDTO, CommentDTO, ProfileDTO, StatsDTO, VoteDTO } from "../../core/types/dto/UserDTO"
import { LanguageDTO, TaskGroupDTO,  TaskDTO, PostResponseDTO, LanguageCUDTO, TaskCUDTO, TaskGroupCUDTO } from "../../core/types/dto/AuxDTO"
import { SnippetDTO, ProposalDTO, AlternativesDTO, ProposalCreateDTO, ProposalUpdateDTO, BareSnippetDTO } from "../../core/types/dto/SnippetDTO"


class HttpClient implements IClient {
    private client: AxiosInstance
    constructor() {
        this.client = createClient();
    }

    snippetsGet(taskGroup: number, lang1: number, lang2: number): Promise<EitherMsg<SnippetDTO[]>> {
        return this.getRequestNoCreds<SnippetDTO[]>(`/snippets/${taskGroup}/${lang1}/${lang2}`)
    }

    snippetsByCode(taskGroup: string, lang1: string, lang2: string): Promise<EitherMsg<SnippetDTO[]>> {
        return this.getRequestNoCreds<SnippetDTO[]>(`/snippets/byCode?taskGroup=${taskGroup}&lang1=${lang1}&lang2=${lang2}`)
    }

    languagesGet(): Promise<EitherMsg<LanguageDTO[]>> {
        return this.getRequestNoCreds<LanguageDTO[]>(`/languages`)
    }

    taskGroupsGet(): Promise<EitherMsg<TaskGroupDTO[]>> {
        return this.getRequestNoCreds<TaskGroupDTO[]>(`/taskGroups`)
    }

    proposalsGet(): Promise<EitherMsg<ProposalDTO[]>> {
        return this.getRequestNoCreds<ProposalDTO[]>(`/proposals`)
    }

    alternativesGet(tlId: number): Promise<EitherMsg<AlternativesDTO[]>> {
        return this.getRequestNoCreds<AlternativesDTO[]>(`/alternatives/${tlId}`)
    }

    alternativesForUserGet(tlId: number, userId: number): Promise<EitherMsg<AlternativesDTO[]>> {
        return this.getRequestNoCreds<AlternativesDTO[]>(`/alternativesForUser/${tlId}/${userId}`)
    }

    proposalCreate(dto: ProposalCreateDTO, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequest<ProposalCreateDTO>(`/secure/proposal/create`, dto, headers)
    }

    proposalGet(snId: number): Promise<EitherMsg<BareSnippetDTO[]>> {
        return this.getRequestNoCreds<BareSnippetDTO[]>(`/snippet/${snId}`)
    }

    proposalUpdate(dto: ProposalUpdateDTO, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequest<ProposalUpdateDTO>(`/admin/proposal/update`, dto, headers)
    }

    proposalApprove(snId: number, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/admin/snippet/approve/${snId}`, headers)
    }

    proposalDecline(snId: number, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/admin/snippet/decline/${snId}`, headers)
    }

    snippetMarkPrimary(tlId: number, snId: number, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequestNoPayload(`/admin/snippet/markPrimary/${tlId}/${snId}`, headers)
    }

    commentsGet(snId: number): Promise<EitherMsg<CommentDTO[]>> {
        return this.getRequestNoCreds<CommentDTO[]>(`/comments/${snId}`)
    }

    commentCreate(dto: CommentCUDTO, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequest("/secure/comment/cu", dto, headers)
    }

    languageCU(dto: LanguageCUDTO, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequest(`/admin/language/cu`, dto, headers)
    }

    taskCU(dto: TaskCUDTO, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequest(`/admin/task/cu`, dto, headers)
    }

    taskGet(taskId: number): Promise<EitherMsg<TaskDTO[]>> {
        return this.getRequestNoCreds(`/admin/task/${taskId}`)
    }

    taskGroupCU(dto: TaskGroupCUDTO, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequest(`/admin/taskGroup/cu`, dto, headers)
    }

    userRegister(dto: RegisterDTO): Promise<EitherMsg<HandshakeResponseDTO[]>> {
        return this.postRequestNoHeaders("/user/register", dto)
    }

    userHandshake(dto: HandshakeDTO): Promise<EitherMsg<HandshakeResponseDTO[]>> {
        return this.postRequestNoHeaders("/user/handshake", dto)
    }

    userSignIn(dto: SignInDTO): Promise<EitherMsg<SignInSuccessDTO[]>> {
        return this.postRequestNoHeaders("/user/signIn", dto)
    }

    userVote(dto: VoteDTO, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
        return this.postRequest("/secure/user/vote", dto, headers)
    }

    userSignInAdmin(dto: SignInAdminDTO): Promise<EitherMsg<SignInSuccessDTO[]>> {
        return this.postRequestNoHeaders("/user/signInAdmin", dto)
    }

    userProfile(headers: SignInSuccessDTO): Promise<EitherMsg<ProfileDTO[]>> {
        return this.getRequest("/secure/user/profile", headers)
    }

    userChangePw(dto: ChangePwDTO, headers: SignInSuccessDTO): Promise<EitherMsg<SignInSuccessDTO[]>> {
        return this.postRequestWithResult("/secure/user/changePw", dto, headers)
    }

    userChangeAdminPw(dto: ChangePwAdminDTO, headers: SignInSuccessDTO): Promise<EitherMsg<SignInSuccessDTO[]>> {
        return this.postRequestWithResult("/admin/changeAdminPw", dto, headers)
    }

    // Admin

    tasksAll(): Promise<EitherMsg<TaskCUDTO[]>> {
        return this.getRequestNoCreds<TaskCUDTO[]>(`/task/all`)
    }

    taskGroupsAll(): Promise<EitherMsg<TaskGroupCUDTO[]>> {
        return this.getRequestNoCreds<TaskGroupCUDTO[]>(`/taskGroup/all`)
    }

    languagesAll(): Promise<EitherMsg<LanguageCUDTO[]>> {
        return this.getRequestNoCreds<LanguageCUDTO[]>(`/language/all`)
    }

    adminStatsGet(): Promise<EitherMsg<StatsDTO[]>> {
        return this.getRequestNoCreds<StatsDTO[]>(`/admin/stats`)
    }

    private async getRequest<T>(url: string, headers: SignInSuccessDTO): Promise<EitherMsg<T>> {
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

    private async getRequestNoCreds<T>(url: string, headers?: SignInSuccessDTO): Promise<EitherMsg<T>> {
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
    private async postRequest<T>(url: string, payload: T, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
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

    private async postRequestNoPayload(url: string, headers: SignInSuccessDTO): Promise<PostResponseDTO> {
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

    private async postRequestWithResult<T, U>(url: string, payload: T, headers: SignInSuccessDTO): Promise<EitherMsg<U>> {
        try {
            const r = await this.client.post<U>(
                url, payload, { headers: { userId: headers.userId.toString() }, withCredentials: true,
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
