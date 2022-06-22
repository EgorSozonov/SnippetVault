import { TaskDTO } from "./AuxDTO"

export type SnippetDTO = {
    leftCode: string,
    leftId: number,
    leftTlId: number,
    leftLibraries?: string,
    taskId: number,
    taskName: string,
    rightCode: string,
    rightId: number,
    rightTlId: number,
    rightLibraries?: string,
}

export type ProposalDTO = {
    proposalId: number,
    content: string,
    authorId: number,
    author: string,
    taskName: string,
    languageName: string,
    tsUpload: Date,
    libraries?: string,
}

export type BareSnippetDTO = {
    content: string,
    libraries?: string,
}

export type ProposalCreateDTO = {
    langId: number,
    taskId: number,
    content: string,
    libraries?: string,
}

export type ProposalUpdateDTO = {
    existingId: number,
    content: string,
    libraries?: string,
}

export type AlternativesDTO = {
    primary: AlternativeDTO,
    task: TaskDTO,
    rows: AlternativeDTO[],
}

export type AlternativeDTO = {
    id: number,
    content: string,
    score: number,
    tsUpload: Date,
    commentCount: number,
    voteFlag: boolean,
    libraries?: string,
}
