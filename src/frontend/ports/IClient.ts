import ServerResponse from "../core/types/ServerResponse"
import { SignInAdminDTO, SignInDTO, ChangePwAdminDTO, ChangePwDTO, RegisterDTO, HandshakeDTO, HandshakeResponseDTO, SignInResponseDTO } from "../core/types/dto/AuthDTO"
import { LanguageCUDTO, LanguageDTO, PostResponseDTO, TaskCUDTO, TaskDTO, TaskGroupCUDTO, TaskGroupDTO } from "../core/types/dto/AuxDTO"
import { SnippetDTO, ProposalDTO, AlternativesDTO, ProposalUpdateDTO, BareSnippetDTO, ProposalCreateDTO } from "../core/types/dto/SnippetDTO"
import { CommentCUDTO, CommentDTO, ProfileDTO, StatsDTO, VoteDTO } from "../core/types/dto/UserDTO"
import ServerEither from "../core/types/ServerEither"


type IClient = {
    snippetsGet: (taskGroup: number, lang1: number, lang2: number) => Promise<ServerResponse<SnippetDTO[]>>
    snippetsByCode: (taskGroup: string, lang1: string, lang2: string) => Promise<ServerResponse<SnippetDTO[]>>
    languagesGet: () => Promise<ServerResponse<LanguageDTO[]>>
    taskGroupsGet: () => Promise<ServerResponse<TaskGroupDTO[]>>

    alternativesGet: (tlId: number) => Promise<ServerResponse<ServerEither<AlternativesDTO>>>
    alternativesForUserGet: (tlId: number, userId: number) => Promise<ServerResponse<ServerEither<AlternativesDTO>>>

    proposalCreate: (dto: ProposalCreateDTO, userId: number) => Promise<PostResponseDTO>
    proposalGet: (snId: number) => Promise<ServerResponse<BareSnippetDTO[]>>
    proposalsGet: () => Promise<ServerResponse<ProposalDTO[]>>
    proposalUpdate: (dto: ProposalUpdateDTO, userId: number) => Promise<PostResponseDTO>
    proposalApprove: (snId: number, userId: number) => Promise<PostResponseDTO>
    proposalDecline: (snId: number, userId: number) => Promise<PostResponseDTO>
    snippetMarkPrimary: (tlId: number, snId: number, userId: number) => Promise<PostResponseDTO>
    commentsGet: (snId: number) => Promise<ServerResponse<CommentDTO[]>>
    commentCreate: (dto: CommentCUDTO, userId: number) => Promise<PostResponseDTO>

    languageCU: (dto: LanguageCUDTO, userId: number) => Promise<PostResponseDTO>
    taskCU: (dto: TaskCUDTO, userId: number) => Promise<PostResponseDTO>
    taskGet: (taskId: number) => Promise<ServerResponse<TaskDTO[]>>
    taskGroupCU: (dto: TaskGroupCUDTO, userId: number) => Promise<PostResponseDTO>

    userRegister: (dto: RegisterDTO) => Promise<ServerResponse<ServerEither<HandshakeResponseDTO>>>
    userHandshake: (dto: HandshakeDTO) => Promise<ServerResponse<ServerEither<HandshakeResponseDTO>>>
    userSignIn: (dto: SignInDTO) => Promise<ServerResponse<ServerEither<SignInResponseDTO>>>

    userSignInAdmin: (dto: SignInAdminDTO) => Promise<ServerResponse<ServerEither<SignInResponseDTO>>>
    userChangePw: (dto: ChangePwDTO) => Promise<ServerResponse<ServerEither<SignInResponseDTO>>>
    userChangeAdminPw: (dto: ChangePwAdminDTO) => Promise<ServerResponse<ServerEither<SignInResponseDTO>>>

    userVote: (dto: VoteDTO, userId: number) => Promise<PostResponseDTO>
    userProfile: (userId: number) => Promise<ServerResponse<ProfileDTO>>


    // Admin
    tasksAll: () => Promise<ServerResponse<TaskCUDTO[]>>
    taskGroupsAll: () => Promise<ServerResponse<TaskGroupCUDTO[]>>
    languagesAll: () => Promise<ServerResponse<LanguageCUDTO[]>>
    adminStatsGet: () => Promise<ServerResponse<StatsDTO[]>>
}

// actionOK: (v: SnippetDTO[]) => void, action: (m: string) => void)
export default IClient
