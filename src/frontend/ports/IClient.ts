import EitherMsg from "../core/types/EitherMsg"
import { SignInAdminDTO, SignInDTO, SignInSuccessDTO, ChangePwAdminDTO as ChangePwAdminDTO, ChangePwDTO as ChangePwDTO } from "../core/types/dto/AuthDTO"
import { LanguageCUDTO, LanguageDTO, PostResponseDTO, TaskCUDTO, TaskDTO, TaskGroupCUDTO, TaskGroupDTO } from "../core/types/dto/AuxDTO"
import { SnippetDTO, ProposalDTO, AlternativesDTO, ProposalUpdateDTO, BareSnippetDTO, ProposalCreateDTO } from "../core/types/dto/SnippetDTO"
import { CommentCUDTO, CommentDTO, ProfileDTO, StatsDTO, VoteDTO } from "../core/types/dto/UserDTO"


type IClient = {
    snippetsGet: (taskGroup: number, lang1: number, lang2: number) => Promise<EitherMsg<SnippetDTO[]>>
    snippetsByCode: (taskGroup: string, lang1: string, lang2: string) => Promise<EitherMsg<SnippetDTO[]>>
    languagesGet: () => Promise<EitherMsg<LanguageDTO[]>>
    taskGroupsGet: () => Promise<EitherMsg<TaskGroupDTO[]>>

    alternativesGet: (tlId: number) => Promise<EitherMsg<AlternativesDTO[]>>
    alternativesForUserGet: (tlId: number, userId: number) => Promise<EitherMsg<AlternativesDTO[]>>

    proposalCreate: (dto: ProposalCreateDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    proposalGet: (snId: number) => Promise<EitherMsg<BareSnippetDTO[]>>
    proposalsGet: () => Promise<EitherMsg<ProposalDTO[]>>
    proposalUpdate: (dto: ProposalUpdateDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    proposalApprove: (snId: number, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    proposalDecline: (snId: number, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    snippetMarkPrimary: (tlId: number, snId: number, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    commentsGet: (snId: number) => Promise<EitherMsg<CommentDTO[]>>
    commentCreate: (dto: CommentCUDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>

    languageCU: (dto: LanguageCUDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    taskCU: (dto: TaskCUDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    taskGet: (taskId: number) => Promise<EitherMsg<TaskDTO[]>>
    taskGroupCU: (dto: TaskGroupCUDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>

    userRegister: (dto: SignInDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>
    userVote: (dto: VoteDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    userSignIn: (dto: SignInDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>
    userSignInAdmin: (dto: SignInAdminDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>
    userProfile: (headers: SignInSuccessDTO) => Promise<EitherMsg<ProfileDTO[]>>
    userChangePw: (dto: ChangePwDTO, headers: SignInSuccessDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>
    userChangeAdminPw: (dto: ChangePwAdminDTO, headers: SignInSuccessDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>

    // Admin
    tasksAll: () => Promise<EitherMsg<TaskCUDTO[]>>
    taskGroupsAll: () => Promise<EitherMsg<TaskGroupCUDTO[]>>
    languagesAll: () => Promise<EitherMsg<LanguageCUDTO[]>>
    adminStatsGet: () => Promise<EitherMsg<StatsDTO[]>>
}

// actionOK: (v: SnippetDTO[]) => void, action: (m: string) => void)
export default IClient
