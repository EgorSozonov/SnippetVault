import LanguageDTO from "../../common/dto/LanguageDTO"
import SnippetDTO from "../../common/dto/SnippetDTO"
import TaskGroupDTO from "../../common/dto/TaskGroupDTO"
import IClient from "../interfaces/IClient"
import EitherMsg from "../types/EitherMsg"


class MockClient implements IClient {
    getSnippets(lang1: number, lang2: number, taskGroup: number): Promise<EitherMsg<SnippetDTO[]>> {
        return this.wrapOK([
            {    
                leftCode: "code in left language();",
                leftId: 1,
                taskId: 1,
                taskName: "Task #1",
                rightCode: "(code (in (right language)))",
                rightId: 2,
            },
            {    
                leftCode: "someOther(code in left language)[1];",
                leftId: 1,
                taskId: 2,
                taskName: "Task #1",
                rightCode: "(some-other (code (in (right language))))",
                rightId: 2,
            },
        ])
    }

    getLanguages(): Promise<EitherMsg<LanguageDTO[]>> {
        return this.wrapOK([
            {id: 1, name: "C#", languageGroup: "Universal", },
            {id: 2, name: "C++", languageGroup: "Universal", },
            {id: 3, name: "Typescript", languageGroup: "Universal", },
        ])
    }    

    getTaskGroups(): Promise<EitherMsg<TaskGroupDTO[]>> {
        return this.wrapOK([
            {id: 1, name: "String manipulation"},
            {id: 2, name: "File system tasks"},
            {id: 3, name: "Common types & operations on them"},
        ])
    }
    
    private wrapOK<T>(val: T): Promise<EitherMsg<T>> {
        return new Promise((resolve) => resolve({isOK: true, value: val}))
    }
}

export default MockClient