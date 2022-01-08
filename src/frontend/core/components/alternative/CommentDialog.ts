import "./Alternative.css"
import { html } from "htm/react"
import { FunctionComponent } from "react"
import { observer } from "mobx-react-lite"
import { fmtDt } from "../../utils/DateUtils";
import { CommentDTO } from "../../types/dto/UserDTO";


type Props = {
    comments: CommentDTO[],
}

const AlternativeComments: FunctionComponent<Props> = observer(({comments}: any) => {            
    return html`                         
        <ol>
            ${comments.map((comm: CommentDTO, idx: number) =>{
                return html`<li key=${idx} class="alternativeItemCommentsComment">
                    <div>
                        <span class="alternativeItemCommentsAuthor">[${fmtDt(comm.tsUpload)}] ${comm.authorName} 
                        </span>
                    </div>
                    <div class="alternativeItemCommentsText">${comm.text}</div>
                </li>
                `
            })}
        </ol>        
    `
})

export default AlternativeComments