type Page =
    | "admin"
    | "snippet"
    | "alternative"
    | "profile"
    | "termsOfService"

type PagePath = {
    url: string,
    urlPrefix?: string,
    description: string,
}

type Paths = {
    [key in Page]: PagePath
}

const PATHS: Paths = {
    "snippet": {description: "View snippets", url: "/", },
    "alternative": {description: "Alternatives & comments", url: "/alternative/:langId/:tlId", urlPrefix: "/alternative", },
    "admin": {description: "Admin page", url: "/adminning", },
    "profile": {description: "Profile", url: "/profile", },
    "termsOfService": {description: "Terms of Service", url: "/termsOfService", },
}

export default PATHS
