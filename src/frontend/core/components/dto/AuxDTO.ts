export type TaskDTO = {
    id: number,
    name: string,
    description: string,
    taskGroupName: string,
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

export type PostResponseDTO = {
    status: string,
}
