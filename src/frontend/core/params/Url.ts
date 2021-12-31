export const ENDPOINTS = {
    snippets: {
        get: "/snippets",
        getByCode: "/snippets/byCode",
    },
    snippet: {
        create: "/snippet/create",
        markPrimary: "/snippet/markPrimary",
        approve: "/snippet/approve",
        delete: "/snippet/delete",
    },
    proposal: {
        post: "/proposal/create",
    },
    proposals: {
        get: "/proposals",
    },
    alternatives: {
        get: "/alternatives",
    },
    language: {        
        create: "/language/create",
        update: "/language/update",
    },
    languages: {
        get: "/languages/get",
        getGrouped: "/languages/getGrouped",
    },
    languageGroup: {
        create: "/languageGroup/create",
        update: "/languageGroup/update",
    },
    languageGroups: {
        get: "/languageGroups",
    },
    task: {
        create: "/task/create",
        update: "/task/update",
    },
    tasks: {
        get: "/tasks",
    },
    taskGroup: {
        create: "/taskGroup/create",
        update: "/taskGroup/update",
    },
    taskGroups: {
        get: "/taskGroups",
    },
    adminCounts: {
        get: "/admin/counts",
    },

    // get: {
    //     snippet: "snippet",
    //     language: "language",
    //     languageReq: "languageReq",
    //     taskGroup: "taskGroup",
    //     languageGroup: "languageGroup",
    //     proposal: "proposal",
    //     task: "task",
    //     alternative: "alternative",
    // }
}
export const PORT = 47000
export const BASE_URL = `http://localhost:${PORT}`

export const API_PREFIX1 = "/api/v1"