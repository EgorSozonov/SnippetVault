import EitherMsg from "../core/types/EitherMsg"
import { SignInAdminDTO, SignInDTO, SignInSuccessDTO } from "../core/types/dto/AuthDTO"
import { LanguageDTO, LanguageGroupDTO, LanguageGroupedDTO, PostResponseDTO, TaskDTO, TaskGroupDTO } from "../core/types/dto/AuxDTO"
import { SnippetDTO, ProposalDTO, AlternativesDTO } from "../core/types/dto/SnippetDTO"
import { ProfileDTO, StatsDTO } from "../core/types/dto/UserDTO"


type IClient = {
    snippetsGet: (taskGroup: number, lang1: number, lang2: number) => Promise<EitherMsg<SnippetDTO[]>>
    snippetsByCode: (taskGroup: string, lang1: string, lang2: string) => Promise<EitherMsg<SnippetDTO[]>>
    languagesGet: () => Promise<EitherMsg<LanguageGroupedDTO[]>>
    languagesReqGet: () => Promise<EitherMsg<LanguageDTO[]>>
    taskGroupsGet: () => Promise<EitherMsg<TaskGroupDTO[]>>
    languageGroupsGet: () => Promise<EitherMsg<LanguageGroupDTO[]>>
    proposalsGet: () => Promise<EitherMsg<ProposalDTO[]>>
    tasksGet: (tgId: number) => Promise<EitherMsg<TaskDTO[]>>
    alternativesGet: (tlId: number) => Promise<EitherMsg<AlternativesDTO[]>>
    adminStatsGet: () => Promise<EitherMsg<StatsDTO[]>>
    proposalCreate: (prop: string, languageId: number, taskId: number, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    proposalApprove: (snId: number, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    proposalDecline: (snId: number, headers: SignInSuccessDTO) => Promise<PostResponseDTO>
    snippetMarkPrimary: (snId: number, headers: SignInSuccessDTO) => Promise<PostResponseDTO>

    languageCU: (headers: SignInSuccessDTO) => Promise<PostResponseDTO> 
    languageGroupCU: (headers: SignInSuccessDTO) => Promise<PostResponseDTO> 
    taskCU: (headers: SignInSuccessDTO) => Promise<PostResponseDTO> 
    taskGroupCU: (headers: SignInSuccessDTO) => Promise<PostResponseDTO> 

    userRegister: (dto: SignInDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>
    userSignIn: (dto: SignInDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>
    userProfile: (headers: SignInSuccessDTO) => Promise<EitherMsg<ProfileDTO[]>>
    adminSignIn: (dto: SignInAdminDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>

}

// actionOK: (v: SnippetDTO[]) => void, action: (m: string) => void)
export default IClient