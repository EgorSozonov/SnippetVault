import EitherMsg from "../core/types/EitherMsg"
import { SignInAdminDTO, SignInDTO, SignInSuccessDTO, ChangePwAdminDTO as ChangePwAdminDTO, ChangePwDTO as ChangePwDTO } from "../core/types/dto/AuthDTO"
import { LanguageDTO, PostResponseDTO, TaskDTO, TaskGroupDTO } from "../core/types/dto/AuxDTO"
import { SnippetDTO, ProposalDTO, AlternativesDTO, ProposalUpdateDTO, BareSnippetDTO } from "../core/types/dto/SnippetDTO"
import { CommentCUDTO, CommentDTO, ProfileDTO, StatsDTO, VoteDTO } from "../core/types/dto/UserDTO"


type IClient = {
    snippetsGet: (taskGroup: number, lang1: number, lang2: number) => Promise<EitherMsg<SnippetDTO[]>>
    snippetsByCode: (taskGroup: string, lang1: string, lang2: string) => Promise<EitherMsg<SnippetDTO[]>>
    languagesGet: () => Promise<EitherMsg<LanguageDTO[]>>
    taskGroupsGet: () => Promise<EitherMsg<TaskGroupDTO[]>>
    proposalsGet: () => Promise<EitherMsg<ProposalDTO[]>>
    alternativesGet: (tlId: number) => Promise<EitherMsg<AlternativesDTO[]>>
    alternativesForUserGet: (tlId: number, userId: number) => Promise<EitherMsg<AlternativesDTO[]>>

    proposalCreate: (prop: string, languageId: number, taskId: number, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    proposalGet: (snId: number) => Promise<EitherMsg<BareSnippetDTO[]>>
    proposalUpdate: (dto: ProposalUpdateDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    proposalApprove: (snId: number, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    proposalDecline: (snId: number, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    snippetMarkPrimary: (snId: number, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    commentsGet: (snId: number) => Promise<EitherMsg<CommentDTO[]>>
    commentCreate: (dto: CommentCUDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>

    languageCU: (headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    taskCU: (headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    taskGet: (taskId: number) => Promise<EitherMsg<TaskDTO[]>>
    taskGroupCU: (headers: SignInSuccessDTO) => Promise<PostResponseDTO>

    userRegister: (dto: SignInDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>
    userVote: (dto: VoteDTO, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    userSignIn: (dto: SignInDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>
    userSignInAdmin: (dto: SignInAdminDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>
    userProfile: (headers: SignInSuccessDTO) => Promise<EitherMsg<ProfileDTO[]>>
    userChangePw: (dto: ChangePwDTO, headers: SignInSuccessDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>
    userChangeAdminPw: (dto: ChangePwAdminDTO, headers: SignInSuccessDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>

    adminStatsGet: () => Promise<EitherMsg<StatsDTO[]>>
}

// actionOK: (v: SnippetDTO[]) => void, action: (m: string) => void)
export default IClient
