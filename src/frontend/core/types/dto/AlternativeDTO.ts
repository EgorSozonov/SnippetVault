export type AlternativesDTO = {
    primary: AlternativeDTO,
    rows: AlternativeDTO[],
}

export type AlternativeDTO = {
    id: number,
    code: string,
    score: number,
    tsUpload: Date,
}
