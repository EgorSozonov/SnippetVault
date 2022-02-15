type Page =
    | "admin"
    | "snippet"
    | "alternative"
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
    "alternative": {description: "Alternatives & comments", url: "/alternative/:langId/:tlId", urlPrefix: "/alternative", },
    "admin": {description: "Admin page", url: "/adminning"},
    "profile": {description: "Profile", url: "/profile"},
}

export default PATHS
