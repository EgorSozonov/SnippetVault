import ServerResponse from "../core/types/ServerResponse"
import { SignInDTO, RegisterDTO, HandshakeDTO, HandshakeResponseDTO, SignInResponseDTO } from "../core/types/dto/AuthDTO"
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
    alternativesForUserGet: (tlId: number, userName: string) => Promise<ServerResponse<ServerEither<AlternativesDTO>>>

    proposalCreate: (dto: ProposalCreateDTO, userName: string) => Promise<PostResponseDTO>
    proposalGet: (snId: number) => Promise<ServerResponse<BareSnippetDTO>>
    proposalsGet: () => Promise<ServerResponse<ProposalDTO[]>>
    proposalUpdate: (dto: ProposalUpdateDTO, userName: string) => Promise<PostResponseDTO>
    proposalApprove: (snId: number, userName: string) => Promise<PostResponseDTO>
    proposalDecline: (snId: number, userName: string) => Promise<PostResponseDTO>
    snippetMarkPrimary: (tlId: number, snId: number, userName: string) => Promise<PostResponseDTO>
    commentsGet: (snId: number) => Promise<ServerResponse<CommentDTO[]>>
    commentCreate: (dto: CommentCUDTO, userName: string) => Promise<PostResponseDTO>

    languageCU: (dto: LanguageCUDTO, userName: string) => Promise<PostResponseDTO>
    taskCU: (dto: TaskCUDTO, userName: string) => Promise<PostResponseDTO>
    taskGet: (taskId: number) => Promise<ServerResponse<TaskDTO[]>>
    taskGroupCU: (dto: TaskGroupCUDTO, userName: string) => Promise<PostResponseDTO>

    userRegister: (dto: RegisterDTO) => Promise<ServerResponse<ServerEither<HandshakeResponseDTO>>>
    userHandshake: (dto: HandshakeDTO) => Promise<ServerResponse<ServerEither<HandshakeResponseDTO>>>
    userHandshakeAdmin: (dto: HandshakeDTO) => Promise<ServerResponse<ServerEither<HandshakeResponseDTO>>>
    userSignIn: (dto: SignInDTO) => Promise<ServerResponse<ServerEither<SignInResponseDTO>>>
    userChangePw: (dto: RegisterDTO) => Promise<ServerResponse<ServerEither<SignInResponseDTO>>>
    adminChangePw: (dto: RegisterDTO) => Promise<ServerResponse<ServerEither<SignInResponseDTO>>>

    userVote: (dto: VoteDTO, userName: string) => Promise<PostResponseDTO>
    userProfile: (userName: string) => Promise<ServerResponse<ProfileDTO>>


    // Admin
    tasksAll: () => Promise<ServerResponse<TaskCUDTO[]>>
    taskGroupsAll: () => Promise<ServerResponse<TaskGroupCUDTO[]>>
    languagesAll: () => Promise<ServerResponse<LanguageCUDTO[]>>
    adminStatsGet: () => Promise<ServerResponse<StatsDTO[]>>
}

// actionOK: (v: SnippetDTO[]) => void, action: (m: string) => void)
export default IClient
