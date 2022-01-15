import { TaskDTO } from "../../core/components/dto/AuxDTO"
import { SnippetDTO, AlternativeDTO, AlternativesDTO } from "../../core/components/dto/SnippetDTO"


export const mockData = {
    snippets: [
            {    
                leftCode: "str.Reverse();",
                leftId: 1,
                leftTlId: 1,
                taskId: 1,
                taskName: "Reverse string",
                rightCode: "str.reverse();",
                rightId: 6,
                rightTlId: 2,
            },            
            {    
                leftCode: "int ind = str.IndexOf(otherStr);",
                leftId: 1,
                leftTlId: 3,
                taskId: 2,
                taskName: "Find substring",
                rightCode: "int ind = str.indexOf(otherStr);",
                rightId: 6,
                rightTlId: 4,
            },
            {    
                leftCode: `string[] files = Directory.GetFiles(thePath, "*", SearchOption.TopDirectoryOnly);`,
                leftId: 1,
                leftTlId: 5,
                taskId: 4,
                taskName: "Walk a folder",
                rightCode: `File(thePath).walk().forEach {
    println(it)
}`,
                rightId: 6,
                rightTlId: 6,
            },            
        ],
    languages: [
            {id: 1, name: "C#", code: "CS", languageGroup: "Universal", languageGroupOrder: 1, },
            {id: 2, name: "C++", code: "CPP", languageGroup: "Universal", languageGroupOrder: 1, },
            {id: 3, name: "Typescript", code: "TS", languageGroup: "Scripting", languageGroupOrder: 2, },
            {id: 4, name: "Python", code: "PY", languageGroup: "Scripting", languageGroupOrder: 2, },
            {id: 5, name: "MySQL", code: "SQL1", languageGroup: "Data querying", languageGroupOrder: 3, },
            {id: 6, name: "Kotlin", code: "KOT", languageGroup: "Universal", languageGroupOrder: 1, },
            {id: 7, name: "Haskell", code: "HS", languageGroup: "Universal", languageGroupOrder: 1, },
            {id: 8, name: "PostgreSQL", code: "SQL2", languageGroup: "Data querying", languageGroupOrder: 3, },
    ],

    languagesReq: [
            {id: 1, name: "C#", lgId: 1, lgName: "Universal", },
            {id: 2, name: "C++", lgId: 1, lgName: "Universal", },
            {id: 3, name: "Typescript", lgId: 2, lgName: "Scripting", },
            {id: 4, name: "Python", lgId: 2, lgName: "Scripting", },
            {id: 5, name: "MySQL", lgId: 3, lgName: "Data querying", },
            {id: 6, name: "Kotlin", lgId: 1, lgName: "Universal", },
            {id: 7, name: "Haskell", lgId: 1, lgName: "Universal", },
            {id: 8, name: "PostgreSQL", lgId: 3, lgName: "Data querying", },
    ],

    languageGroups: [
        {id: 1, name: "Universal", order: 1, }, 
        {id: 2, name: "Scripting", order: 2, }, 
        {id: 3, name: "Data querying", order: 3, }, 
    ],

    taskGroups: [
        {id: 1, code: "STRINGS", name: "String manipulation"},
        {id: 2, code: "FILES", name: "File system"},
        {id: 3, code: "PRIMTYPES", name: "Primitive types"},
        {id: 4, code: "MATH", name: "Math"},
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
            proposalId: 10,
            proposalCode: "proposal code();",
            taskName: "Walk a folder",
            authorId: 1,
            author: "Joe",
            languageName: "C#",
            tsUpload: new Date(2021, 11, 28),
        },
        {
            proposalId: 11,
            proposalCode: "a different code(5);",
            taskName: "Walk a folder",
            authorId: 1,
            author: "Joe",
            languageName: "C#",
            tsUpload: new Date(2021, 10, 25),
        },
        {
            proposalId: 12,
            proposalCode: "public static virtual void final sin(double x) throws AComplexBusinessExceptionEveryTime()",
            taskName: "Sine function",
            authorId: 1,
            author: "Joe",
            languageName: "Java",
            tsUpload: new Date(2021, 11, 22),
        },                
    ],

    primaryAlternative: {id: 5, code: "differentFoo(blahBlach[4]);", score: 10,                          
            tsUpload: new Date(2021, 12, 2), },
        
    alternatives: [
        {tlId: 1, value: {id: 5, code: "differentFoo(blahBlach[4]);", score: 10,                          
            tsUpload: new Date(2021, 12, 2), },
        },
        {tlId: 1, value: {id: 6, code: "aHighScoreAlternative(blahBlach[4]);", score: 22, 
            isPrimary: false, comments: [], tsUpload: new Date(2021, 11, 15), },
        },
        {tlId: 1, value: {id: 7, code: "differentFoo(blahBlach[4]);", score: 10, 
            isPrimary: false, comments: [], tsUpload: new Date(2021, 12, 2), },
        },
        {tlId: 1, value: {id: 8, code: "aHighScoreAlternative(blahBlach[4]);", score: 22, 
            isPrimary: false, comments: [], tsUpload: new Date(2021, 11, 15), },
        },
        {tlId: 1, value: {id: 9, code: "differentFoo(blahBlach[4]);", score: 10, 
            isPrimary: false, comments: [], tsUpload: new Date(2021, 12, 2), },
        },
        {tlId: 1, value: {id: 10, code: "aHighScoreAlternative(blahBlach[4]);", score: 22, 
            isPrimary: false, comments: [], tsUpload: new Date(2021, 11, 15), },
        },
        {tlId: 1, value: {id: 11, code: "differentFoo(blahBlach[4]);", score: 10, 
            isPrimary: false, comments: [], tsUpload: new Date(2021, 12, 2), },
        },
        {tlId: 1, value: {id: 12, code: "aHighScoreAlternative(blahBlach[4]);", score: 22, 
            isPrimary: false, comments: [], tsUpload: new Date(2021, 11, 15), },
        },
        {tlId: 1, value: {id: 13, code: "aHighScoreAlternative(blahBlach[4]);", score: 22, 
            isPrimary: false, comments: [], tsUpload: new Date(2021, 11, 15), },
        },
        {tlId: 1, value: {id: 14, code: `foo(blahBlach[4]);\nsfs\nsdf\nsdgsd;`, score: 15, 
            isPrimary: true, comments: [], tsUpload: new Date(2021, 11, 5), },
        },
        {tlId: 6, value: {id: 15, code: "foo(blahBlach[4]);", score: 10, 
            isPrimary: true, comments: [], tsUpload: new Date(2021, 12, 1), },
        },    
        {tlId: 6, value: {id: 16, code: "javaAlternative(blahBlach[6]);", score: 5, 
            isPrimary: false, comments: [], tsUpload: new Date(2021, 12, 2), },
        },            
    ],
    userProfile: { proposalCount: 10, approvedCount: 4, primaryCount: 1, tsJoined: new Date()},
}

export function getMockSnippets(tgId: number, lang1: number, lang2: number): SnippetDTO[] {
    const tasks = getMockTasks(tgId)
    return mockData.snippets.filter(x => x.leftId == lang1 && tasks.some(y => y.id == x.taskId) && x.rightId == lang2)
}

export function getMockSnippetsByCode(tgCode: string, lang1Code: string, lang2Code: string): SnippetDTO[] {
    const tasks = getMockTasksByCode(tgCode)
    const lang1 = mockData.languages.find(x => x.code === lang1Code)
    const lang2 = mockData.languages.find(x => x.code === lang2Code)
    if (!lang1 || !lang2) return []
    return mockData.snippets.filter(x => x.leftId == lang1.id && tasks.some(y => y.id == x.taskId) && x.rightId == lang2.id)
}

export function getMockTasks(tgId: number): TaskDTO[] {
    return mockData.tasks.filter(x => x.tgId == tgId).map(y => y.value)
}

export function getMockTasksByCode(tgCode: string): TaskDTO[] {
    const tgId = mockData.taskGroups.find(x => x.code === tgCode)?.id
    return mockData.tasks.filter(x => x.tgId == tgId).map(y => y.value)
}

export function getMockAlternatives(tlId: number): AlternativesDTO[] {
    const rows = mockData.alternatives.filter(x => x.tlId === tlId).map(y => y.value)
    return [{primary: mockData.primaryAlternative, rows, }]
}
