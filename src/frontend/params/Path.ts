type Page = 
    | "admin"
    | "snippet"
    | "alternative"
    | "proposal"
    | "taskGroup"
    | "languageGroup"

type PagePath = { 
    url: string, 
    description: string,
}

type Paths = {
    [key in Page]: PagePath
}

const PATHS: Paths = {
    "snippet": {description: "View snippets", url: "/sn"},
    "alternative": {description: "Alternatives & comments", url: "/alternative/:langId/:taskId"},
    "proposal": {description: "New snippet proposals", url: "/proposal"},
    "taskGroup": {description: "Edit task group", url: "/taskGroup/:tgId"},
    "languageGroup": {description: "Edit language group", url: "/languageGroup/:lgId"},
    "admin": {description: "Admin page", url: "/adminning"},
}

export default PATHS