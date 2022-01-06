import EitherMsg from "../core/types/EitherMsg"
import { SignInAdminDTO, SignInDTO, SignInSuccessDTO } from "../core/types/dto/AuthDTO"
import { LanguageDTO, LanguageGroupDTO, LanguageGroupedDTO, TaskDTO, TaskGroupDTO } from "../core/types/dto/AuxDTO"
import { SnippetDTO, ProposalDTO, AlternativesDTO } from "../core/types/dto/SnippetDTO"
import { ProfileDTO, StatsDTO } from "../core/types/dto/UserDTO"


type IClient = {
    getSnippets: (taskGroup: number, lang1: number, lang2: number) => Promise<EitherMsg<SnippetDTO[]>>
    getSnippetsByCode: (taskGroup: string, lang1: string, lang2: string) => Promise<EitherMsg<SnippetDTO[]>>
    getLanguages: () => Promise<EitherMsg<LanguageGroupedDTO[]>>
    getLanguagesReq: () => Promise<EitherMsg<LanguageDTO[]>>
    getTaskGroups: () => Promise<EitherMsg<TaskGroupDTO[]>>
    getLanguageGroups: () => Promise<EitherMsg<LanguageGroupDTO[]>>
    getProposals: () => Promise<EitherMsg<ProposalDTO[]>>
    getTasks: (tgId: number) => Promise<EitherMsg<TaskDTO[]>>
    getAlternatives: (tlId: number) => Promise<EitherMsg<AlternativesDTO[]>>
    getAdminStats: () => Promise<EitherMsg<StatsDTO[]>>
    proposalCreate: (prop: string, languageId: number, taskId: number, headers: SignInSuccessDTO) => Promise<string>
    proposalApprove: (snId: number, headers: SignInSuccessDTO) => Promise<string>
    proposalDecline: (snId: number, headers: SignInSuccessDTO) => Promise<string>
    snippetMarkPrimary: (snId: number, headers: SignInSuccessDTO) => Promise<string>

    userRegister: (dto: SignInDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>
    userSignIn: (dto: SignInDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>
    userProfile: (userId: number) => Promise<EitherMsg<ProfileDTO[]>>
    adminSignIn: (dto: SignInAdminDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>

}

// actionOK: (v: SnippetDTO[]) => void, action: (m: string) => void)
export default IClient