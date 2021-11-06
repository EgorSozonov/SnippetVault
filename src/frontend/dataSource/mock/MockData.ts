import AlternativeDTO from "../../../common/dto/AlternativeDTO"
import TaskDTO from "../../../common/dto/TaskDTO"

const mockData = {
    snippets: [
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
                taskName: "Task #2",
                rightCode: "(some-other (code (in (right language))))",
                rightId: 2,
            },
        ],
    languages: [
            {id: 1, name: "C#", languageGroup: "Universal", languageGroupOrder: 1, },
            {id: 2, name: "C++", languageGroup: "Universal", languageGroupOrder: 1, },
            {id: 3, name: "Typescript", languageGroup: "Scripting", languageGroupOrder: 2, },
            {id: 4, name: "Python", languageGroup: "Scripting", languageGroupOrder: 2, },
            {id: 5, name: "MySQL", languageGroup: "Data querying", languageGroupOrder: 3, },
            {id: 6, name: "Java", languageGroup: "Universal", languageGroupOrder: 1, },
            {id: 7, name: "Haskell", languageGroup: "Universal", languageGroupOrder: 1, },
            {id: 8, name: "PostgreSQL", languageGroup: "Data querying", languageGroupOrder: 3, },
        ],
    languageGroups: [],
    taskGroups: [
        {id: 1, name: "String manipulation"},
        {id: 2, name: "File system"},
        {id: 3, name: "Primitive types"},
        {id: 4, name: "Math"},
    ],

    tasks: [
        {id: 1, tgId: 1, name: "Reverse string"},
        {id: 2, tgId: 1, name: "Find substring"},
        {id: 3, tgId: 1, name: "Regex match"},
        {id: 4, tgId: 2, name: "Walk a folder"},
        {id: 5, tgId: 3, name: "String -> number"},
        {id: 6, tgId: 3, name: "Number -> string"},
        {id: 7, tgId: 4, name: "Sine function"},
        {id: 8, tgId: 4, name: "Cosine function"},
    ],
    proposals: [],
    alternatives: [
        {langId: 1, taskId: 1, code: "Reverse string"},

    ],
    getTasks: (tgId: number): TaskDTO[] => {
        return []
    },
    getAlternatives: (langId: number, taskId: number): AlternativeDTO[] => {
        return []
    }
}
export default mockData