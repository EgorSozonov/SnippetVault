export type TaskDTO = {
    id: number,
    name: string,
}

export type TaskGroupDTO = {
    id: number,
    name: string,
    code: string,
}

export type LanguageDTO = {
    id: number,
    name: string,
    lgId: number,
    lgName: string,
}

export type LanguageGroupDTO = {
    id: number,
    name: string,
    order: number,
}

export type LanguageGroupedDTO = {
    id: number,
    name: string,
    code: string,
    languageGroup: string,
    languageGroupOrder: number,
}