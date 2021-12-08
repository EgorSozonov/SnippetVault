import CommentDTO from "./CommentDTO"

type AlternativeDTO = {
    snippetId: number,
    snippetCode: string, 
    score: number,
    isPrimary: boolean,
    comments: CommentDTO[],
    tsUpload: Date,
}

export default AlternativeDTO
