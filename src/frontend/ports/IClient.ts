import AlternativeDTO from "../core/types/dto/AlternativeDTO";
import LanguageGroupedDTO from "../core/types/dto/LanguageGroupedDTO";
import LanguageGroupDTO from "../core/types/dto/LanguageGroupDTO";
import LanguageDTO from "../core/types/dto/LanguageDTO";
import ProposalDTO from "../core/types/dto/ProposalDTO";
import SnippetDTO from "../core/types/dto/SnippetDTO";
import TaskDTO from "../core/types/dto/TaskDTO";
import TaskGroupDTO from "../core/types/dto/TaskGroupDTO";
import EitherMsg from "../types/EitherMsg";


type IClient = {
    getSnippets: (lang1: number, lang2: number, taskGroup: number) => Promise<EitherMsg<SnippetDTO[]>>
    getLanguages: () => Promise<EitherMsg<LanguageGroupedDTO[]>>
    getLanguagesReq: () => Promise<EitherMsg<LanguageDTO[]>>
    getTaskGroups: () => Promise<EitherMsg<TaskGroupDTO[]>>
    getLanguageGroups: () => Promise<EitherMsg<LanguageGroupDTO[]>>
    getProposals: () => Promise<EitherMsg<ProposalDTO[]>>
    getTasks: (tgId: number) => Promise<EitherMsg<TaskDTO[]>>
    getAlternatives: (langId: number, taskId: number) => Promise<EitherMsg<AlternativeDTO[]>>
    getAdminCounts: () => Promise<EitherMsg<string>>
    proposalCreate: (prop: string, languageId: number, taskId: number) => Promise<string>
    proposalApprove: (snId: number) => Promise<string>
    snippetMarkPrimary: (snId: number) => Promise<string>
}

// actionOK: (v: SnippetDTO[]) => void, action: (m: string) => void)
export default IClient