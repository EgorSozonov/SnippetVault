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
    code: string,
    name: string,
    sortingOrder: number,
}

export type PostResponseDTO = {
    status: string,
}
