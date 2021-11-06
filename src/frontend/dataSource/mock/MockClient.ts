import LanguageDTO from "../../../common/dto/LanguageDTO"
import SnippetDTO from "../../../common/dto/SnippetDTO"
import TaskGroupDTO from "../../../common/dto/TaskGroupDTO"
import IClient from "../../interfaces/IClient"
import EitherMsg from "../../types/EitherMsg"
import mockData from "./MockData"


class MockClient implements IClient {
    getSnippets(lang1: number, lang2: number, taskGroup: number): Promise<EitherMsg<SnippetDTO[]>> {
        return this.wrapOK(mockData.snippets)
    }

    getLanguages(): Promise<EitherMsg<LanguageDTO[]>> {
        return this.wrapOK(mockData.languages)
    }    

    getTaskGroups(): Promise<EitherMsg<TaskGroupDTO[]>> {
        return this.wrapOK(mockData.taskGroups)
    }
    
    private wrapOK<T>(val: T): Promise<EitherMsg<T>> {
        return new Promise((resolve) => resolve({isOK: true, value: val}))
    }
}

export default MockClient