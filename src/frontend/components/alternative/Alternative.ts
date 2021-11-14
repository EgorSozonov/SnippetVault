import "./Alternative.css"
import { html } from "htm/react"
import { FunctionComponent, useContext, useState } from "react"
import AlternativeDTO from "../../../common/dto/AlternativeDTO"
import { observer } from "mobx-react-lite"
import { fmtDt } from "../../utils/DateFormat"
import CommentDTO from "../../../common/dto/CommentDTO"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"


type Props = {
    alternative: AlternativeDTO,
}

const Alternative: FunctionComponent<Props> = observer(({alternative}: Props) => {
    const [isShowingComments, setIsShowingComments] = useState(false)

    const flipComments = () => {
        setIsShowingComments(!isShowingComments)
    }

    const voteHandler = () => {
        console.log("vote handler")
    }
    const state = useContext<MainState>(StoreContext)
    const isLoggedIn = state.user.userStatus === "user"

    return html`                 
        <div class="alternativeItem">
            <div class="alternativeItemCode">
                ${alternative.snippetCode}
            </div>
            <div class="alternativeItemHeader">
                <span>
                    Date of upload: ${fmtDt(alternative.tsUpload)}
                </span>
                <span>
                    Votes: ${alternative.score}
                </span>
            </div>            
            <div class="alternativeItemFooter">
                <span class="alternativeItemFooterVote" onClick=${voteHandler}>
                    <span class="alternativeItemButton">V</span>Vote
                </span>
                <span class="alternativeItemFooterComments" onClick=${flipComments}>
                    <span class="alternativeItemButton">C</span>Comments
                </span>    
            </div>
            ${isShowingComments === true &&
                html`
                <div class="alternativeItemComments">
                    <ol>
                    ${alternative.comments.map((comm: CommentDTO, idx: number) =>{
                        return html`<li class="alternativeItemCommentsComment">
                            <div>[${fmtDt(comm.tsUpload)}] ${comm.authorName} </div>
                            <div>${comm.text}</div>
                        </li>
                        `
                    })}
                    </ol>
                    ${isLoggedIn === true && 
                        html`<textarea></textarea>`
                    }
                </div>
                `
            }
        </div>        
    `
})

export default Alternative