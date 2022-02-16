import SelectChoice from "../SelectChoice"

export type TaskDTO = {
    id: number,
    name: string,
    description: string,
    taskGroupName: string,
}

export type TaskCUDTO = {
    existingId: number,
    name: string,
    description: string,
    taskGroup: SelectChoice,
    isDeleted: boolean,
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

export type TaskGroupCUDTO = {
    existingId: number,
    name: string,
    code: string,
    isDeleted: boolean,
}

export type LanguageCUDTO = {
    existingId: number,
    code: string,
    name: string,
    sortingOrder: number,
    isDeleted: boolean,
}

export type PostResponseDTO = {
    status: string,
}
