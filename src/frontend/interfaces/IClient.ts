import LanguageDTO from "../../common/dto/LanguageDTO";
import SnippetDTO from "../../common/dto/SnippetDTO";
import TaskGroupDTO from "../../common/dto/TaskGroupDTO";


type IClient = {
    getSnippets: (lang1: number, lang2: number, taskGroup: number) => Option<SnippetDTO[]>
    getLanguages: () => Option<LanguageDTO[]>
    getTaskGroups: () => Option<TaskGroupDTO[]>

}
export default IClient