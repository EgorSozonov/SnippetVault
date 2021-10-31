import LanguageDTO from "../../common/dto/LanguageDTO";
import Snippet from "../../common/dto/SnippetDTO";
import SnippetDTO from "../../common/dto/SnippetDTO";
import TaskGroupDTO from "../../common/dto/TaskGroupDTO";
import EitherMsg from "../types/EitherMsg";


type IClient = {
    getSnippets: (lang1: number, lang2: number, taskGroup: number) => Promise<EitherMsg<SnippetDTO[]>>
    getLanguages: () => Promise<EitherMsg<LanguageDTO[]>>
    getTaskGroups: () => Promise<EitherMsg<TaskGroupDTO[]>>
}

// actionOK: (v: SnippetDTO[]) => void, action: (m: string) => void)
export default IClient