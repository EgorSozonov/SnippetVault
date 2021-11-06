import AlternativeDTO from "../../common/dto/AlternativeDTO";
import LanguageDTO from "../../common/dto/LanguageDTO";
import LanguageGroupDTO from "../../common/dto/LanguageGroupDTO";
import ProposalDTO from "../../common/dto/ProposalDTO";
import SnippetDTO from "../../common/dto/SnippetDTO";
import TaskDTO from "../../common/dto/TaskDTO";
import TaskGroupDTO from "../../common/dto/TaskGroupDTO";
import EitherMsg from "../types/EitherMsg";


type IClient = {
    getSnippets: (lang1: number, lang2: number, taskGroup: number) => Promise<EitherMsg<SnippetDTO[]>>
    getLanguages: () => Promise<EitherMsg<LanguageDTO[]>>
    getTaskGroups: () => Promise<EitherMsg<TaskGroupDTO[]>>
    getLanguageGroups: () => Promise<EitherMsg<LanguageGroupDTO[]>>
    getProposals: () => Promise<EitherMsg<ProposalDTO[]>>
    getTasks: (tgId: number) => Promise<EitherMsg<TaskDTO[]>>
    getAlternatives: (langId: number, taskId: number) => Promise<EitherMsg<AlternativeDTO[]>>
}

// actionOK: (v: SnippetDTO[]) => void, action: (m: string) => void)
export default IClient