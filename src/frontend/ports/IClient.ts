import ServerResponse from "../core/types/ServerResponse"
import { SignInAdminDTO, SignInDTO, SignInSuccessDTO, ChangePwAdminDTO, ChangePwDTO, RegisterDTO, HandshakeDTO, HandshakeResponseDTO, SignInResponseDTO } from "../core/types/dto/AuthDTO"
import { LanguageCUDTO, LanguageDTO, PostResponseDTO, TaskCUDTO, TaskDTO, TaskGroupCUDTO, TaskGroupDTO } from "../core/types/dto/AuxDTO"
import { SnippetDTO, ProposalDTO, AlternativesDTO, ProposalUpdateDTO, BareSnippetDTO, ProposalCreateDTO } from "../core/types/dto/SnippetDTO"
import { CommentCUDTO, CommentDTO, ProfileDTO, StatsDTO, VoteDTO } from "../core/types/dto/UserDTO"
import ServerEither from "../core/types/ServerEither"


type IClient = {
    snippetsGet: (taskGroup: number, lang1: number, lang2: number) => Promise<ServerResponse<SnippetDTO[]>>
    snippetsByCode: (taskGroup: string, lang1: string, lang2: string) => Promise<ServerResponse<SnippetDTO[]>>
    languagesGet: () => Promise<ServerResponse<LanguageDTO[]>>
    taskGroupsGet: () => Promise<ServerResponse<TaskGroupDTO[]>>

    alternativesGet: (tlId: number) => Promise<ServerResponse<AlternativesDTO[]>>
    alternativesForUserGet: (tlId: number, userId: number) => Promise<ServerResponse<AlternativesDTO[]>>

    proposalCreate: (dto: ProposalCreateDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    proposalGet: (snId: number) => Promise<ServerResponse<BareSnippetDTO[]>>
    proposalsGet: () => Promise<ServerResponse<ProposalDTO[]>>
    proposalUpdate: (dto: ProposalUpdateDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    proposalApprove: (snId: number, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    proposalDecline: (snId: number, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    snippetMarkPrimary: (tlId: number, snId: number, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    commentsGet: (snId: number) => Promise<ServerResponse<CommentDTO[]>>
    commentCreate: (dto: CommentCUDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>

    languageCU: (dto: LanguageCUDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    taskCU: (dto: TaskCUDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    taskGet: (taskId: number) => Promise<ServerResponse<TaskDTO[]>>
    taskGroupCU: (dto: TaskGroupCUDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>

    userRegister: (dto: RegisterDTO) => Promise<ServerResponse<ServerEither<HandshakeResponseDTO>>>
    userHandshake: (dto: HandshakeDTO) => Promise<ServerResponse<ServerEither<HandshakeResponseDTO>>>
    userSignIn: (dto: SignInDTO) => Promise<ServerResponse<ServerEither<SignInResponseDTO>>>

    userSignInAdmin: (dto: SignInAdminDTO) => Promise<ServerResponse<SignInSuccessDTO[]>>
    userChangePw: (dto: ChangePwDTO, headers: SignInSuccessDTO) => Promise<ServerResponse<SignInSuccessDTO[]>>
    userChangeAdminPw: (dto: ChangePwAdminDTO, headers: SignInSuccessDTO) => Promise<ServerResponse<SignInSuccessDTO[]>>

    userVote: (dto: VoteDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    userProfile: (headers: SignInSuccessDTO) => Promise<ServerResponse<ProfileDTO[]>>


    // Admin
    tasksAll: () => Promise<ServerResponse<TaskCUDTO[]>>
    taskGroupsAll: () => Promise<ServerResponse<TaskGroupCUDTO[]>>
    languagesAll: () => Promise<ServerResponse<LanguageCUDTO[]>>
    adminStatsGet: () => Promise<ServerResponse<StatsDTO[]>>
}

// actionOK: (v: SnippetDTO[]) => void, action: (m: string) => void)
export default IClient
