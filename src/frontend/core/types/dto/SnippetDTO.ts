import { TaskDTO } from "./AuxDTO"

export type SnippetDTO = {
    leftCode: string,
    leftId: number,
    leftTlId: number,
    taskId: number,
    taskName: string,
    rightCode: string,
    rightId: number,
    rightTlId: number,
}

export type ProposalDTO = {
    proposalId: number,
    proposalCode: string,
    authorId: number,
    author: string,
    taskName: string,
    languageName: string,
    tsUpload: Date,
}

export type ProposalCreateDTO = {
    langId: number,
    taskId: number,
    content: string,
}

export type AlternativesDTO = {
    primary: AlternativeDTO,
    task: TaskDTO,
    rows: AlternativeDTO[],
}

export type AlternativeDTO = {
    id: number,
    code: string,
    score: number,
    tsUpload: Date,
    commentCount: number,
    voteFlag: boolean,
}


