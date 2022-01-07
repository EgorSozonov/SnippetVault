type Page = 
    | "admin"
    | "snippet"
    | "alternative"
    | "proposal"
    | "taskGroup"
    | "languageGroup"
    | "profile"

type PagePath = { 
    url: string, 
    urlPrefix?: string,
    description: string,
}

type Paths = {
    [key in Page]: PagePath
}

const PATHS: Paths = {
    "snippet": {description: "View snippets", url: "/sn"},
    "alternative": {description: "Alternatives & comments", url: "/alternative/:taskId/:langId/:tlId", urlPrefix: "/alternative", },
    "proposal": {description: "New snippet proposals", url: "/proposal"},
    "taskGroup": {description: "Edit task group", url: "/taskGroup/:tgId", urlPrefix: "/taskGroup", },
    "languageGroup": {description: "Edit language group", url: "/languageGroup/:lgId", urlPrefix: "/languageGroup", },
    "admin": {description: "Admin page", url: "/adminning"},
    "profile": {description: "Profile", url: "/profile"},
}

export default PATHS