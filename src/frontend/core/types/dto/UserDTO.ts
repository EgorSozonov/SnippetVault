export type CommentDTO = {
    id: number,
    author: string,
    content: string,
    tsUpload: Date,
}

export type CommentCUDTO = {
    snId: number,
    content: string,
    existingId?: number,
    isDeleted: boolean,
}

export type ProfileDTO = {
    proposalCount: number,
    approvedCount: number,
    primaryCount: number,
    tsJoined: Date,
}

export type VoteDTO = {
    snId: number,
    tlId: number,
}

export type StatsDTO = {
    primaryCount: number,
    alternativeCount: number,
    proposalCount: number,
    userCount: number,
}
