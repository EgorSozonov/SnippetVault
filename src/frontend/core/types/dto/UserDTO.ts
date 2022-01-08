export type CommentDTO = {
    authorId: number,
    authorName: string,
    text: string,
    tsUpload: Date,
}

export type CommentCUDTO = {
    snId: number,
    content: string,
    existingId?: number,
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
