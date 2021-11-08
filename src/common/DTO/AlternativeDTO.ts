import CommentDTO from "./CommentDTO"

type AlternativeDTO = {
    primaryId: number,
    primaryCode: string, 
    primaryScore: number,
    alternativeId: number,
    alternativeCode: string,
    alternativeScore: number,
    comments: CommentDTO[],
    tsUpload: Date,
}

export default AlternativeDTO
