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
    taskGroups: [
        {id: 1, name: "String manipulation"},
        {id: 2, name: "File system"},
        {id: 3, name: "Primitive types"},
        {id: 4, name: "Math"},
    ]
        
}
export default mockData