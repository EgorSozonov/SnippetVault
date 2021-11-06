import AlternativeDTO from "../../../common/dto/AlternativeDTO"
import TaskDTO from "../../../common/dto/TaskDTO"

export const mockData = {
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

    languageGroups: [
        {id: 1, name: "Universal", order: 1, }, 
        {id: 2, name: "Scripting", order: 2, }, 
        {id: 3, name: "Data querying", order: 3, }, 
    ],

    taskGroups: [
        {id: 1, name: "String manipulation"},
        {id: 2, name: "File system"},
        {id: 3, name: "Primitive types"},
        {id: 4, name: "Math"},
    ],

    tasks: [
        {tgId: 1, value: {id: 1, name: "Reverse string"}, },
        {tgId: 1, value: {id: 2, name: "Find substring"}, },
        {tgId: 1, value: {id: 3, name: "Regex match"}, },
        {tgId: 2, value: {id: 4, name: "Walk a folder"}, },
        {tgId: 3, value: {id: 5, name: "String -> number"}, },
        {tgId: 3, value: {id: 6, name: "Number -> string"}, },
        {tgId: 4, value: {id: 7, name: "Sine function"}, },
        {tgId: 4, value: {id: 8, name: "Cosine function"}, },
    ],

    proposals: [
        {
            id: 10,
            code: "proposal code();",
            taskName: "Walk a folder",
            languageName: "C#",
            tsUpload: new Date(2021, 11, 28),
        },
        {
            id: 11,
            code: "a different code();",
            taskName: "Walk a folder",
            languageName: "C#",
            tsUpload: new Date(2021, 11, 28),
        },
        {
            id: 12,
            code: "public static virtual void final sin(double x) throws AComplexBusinessExceptionEveryTime()",
            taskName: "Sine function",
            languageName: "Java",
            tsUpload: new Date(2021, 11, 28),
        },                
    ],

    alternatives: [
        {langId: 1, taskId: 1, value: {primaryId: 5, primaryCode: "foo(blahBlach[4]);", primaryScore: 10, 
            alternativeId: 8, alternativeCode: "differentFoo(blahBlach[4]);", alternativeScore: 12, tsUpload: new Date(2021, 12, 2), },
        },
        {langId: 1, taskId: 1, value: {primaryId: 5, primaryCode: "foo(blahBlach[4]);", primaryScore: 10, 
            alternativeId: 9, alternativeCode: "aHighScoreAlternative(blahBlach[4]);", alternativeScore: 22, tsUpload: new Date(2021, 12, 2), },
        },
        {langId: 1, taskId: 1, value: {primaryId: 5, primaryCode: "foo(blahBlach[4]);", primaryScore: 10, 
            alternativeId: 11, alternativeCode: "aModerateScoreAlternative(blahBlach[4]);", alternativeScore: 15, tsUpload: new Date(2021, 12, 2), },
        },
        {langId: 6, taskId: 1, value: {primaryId: 5, primaryCode: "foo(blahBlach[4]);", primaryScore: 10, 
            alternativeId: 18, alternativeCode: "javaAlternative(blahBlach[6]);", alternativeScore: 12, tsUpload: new Date(2021, 12, 2), },
        },    
    ],

}

export function getMockTasks(tgId: number): TaskDTO[] {
    return mockData.tasks.filter(x => x.tgId == tgId).map(y => y.value)
}

export function getMockAlternatives(langId: number, taskId: number): AlternativeDTO[] {
    return mockData.alternatives.filter(x => x.langId == langId && x.taskId == taskId).map(y => y.value)
}
