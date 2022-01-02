import AlternativeDTO from "../core/types/dto/AlternativeDTO"
import LanguageGroupedDTO from "../core/types/dto/LanguageGroupedDTO"
import LanguageGroupDTO from "../core/types/dto/LanguageGroupDTO"
import LanguageDTO from "../core/types/dto/LanguageDTO"
import ProposalDTO from "../core/types/dto/ProposalDTO"
import SnippetDTO from "../core/types/dto/SnippetDTO"
import TaskDTO from "../core/types/dto/TaskDTO"
import TaskGroupDTO from "../core/types/dto/TaskGroupDTO"
import EitherMsg from "../core/types/EitherMsg"
import { SignInAdminDTO, SignInDTO, SignInSuccessDTO } from "../core/types/dto/AuthDTO"


type IClient = {
    getSnippets: (taskGroup: number, lang1: number, lang2: number) => Promise<EitherMsg<SnippetDTO[]>>
    getSnippetsByCode: (taskGroup: string, lang1: string, lang2: string) => Promise<EitherMsg<SnippetDTO[]>>
    getLanguages: () => Promise<EitherMsg<LanguageGroupedDTO[]>>
    getLanguagesReq: () => Promise<EitherMsg<LanguageDTO[]>>
    getTaskGroups: () => Promise<EitherMsg<TaskGroupDTO[]>>
    getLanguageGroups: () => Promise<EitherMsg<LanguageGroupDTO[]>>
    getProposals: () => Promise<EitherMsg<ProposalDTO[]>>
    getTasks: (tgId: number) => Promise<EitherMsg<TaskDTO[]>>
    getAlternatives: (tlId: number) => Promise<EitherMsg<AlternativeDTO[]>>
    getAdminCounts: () => Promise<EitherMsg<string>>
    proposalCreate: (prop: string, languageId: number, taskId: number, headers: SignInSuccessDTO) => Promise<string>
    proposalApprove: (snId: number) => Promise<string>
    snippetMarkPrimary: (snId: number) => Promise<string>

    userRegister: (dto: SignInDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>
    userSignIn: (dto: SignInDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>
    adminSignIn: (dto: SignInAdminDTO) => Promise<EitherMsg<SignInSuccessDTO[]>>
}

// actionOK: (v: SnippetDTO[]) => void, action: (m: string) => void)
export default IClient