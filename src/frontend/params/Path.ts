type Page = 
    | "admin"
    | "snippet"
    | "alternative"
    | "group"

type PagePath = { 
    url: string, 
    description: string,
}

type Paths = {
    [key in Page]: PagePath
}

const PATHS: Paths = {
    "snippet": {description: "View snippets", url: "/sn"},
    "alternative": {description: "Alternatives & comments", url: "/alternative"},
    "group": {description: "Edit task group", url: "/group"},
    "admin": {description: "Admin page", url: "/adminning"},
}

export default PATHS