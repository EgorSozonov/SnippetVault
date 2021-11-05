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
            {id: 1, name: "C#", languageGroup: "Universal", },
            {id: 2, name: "C++", languageGroup: "Universal", },
            {id: 3, name: "Typescript", languageGroup: "Scripting", },
            {id: 4, name: "Python", languageGroup: "Scripting", },
            {id: 5, name: "MySQL", languageGroup: "Data querying", },
            {id: 6, name: "Java", languageGroup: "Universal", },
            {id: 7, name: "Haskell", languageGroup: "Universal", },
        ],
    taskGroups: [
        {id: 1, name: "String manipulation"},
        {id: 2, name: "File system tasks"},
        {id: 3, name: "Common types & operations on them"},
    ]
        
}
export default mockData