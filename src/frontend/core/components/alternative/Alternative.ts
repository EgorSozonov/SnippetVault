import "./Alternative.css"
import { html } from "htm/react"
import { FunctionComponent, useContext, useState } from "react"
import { observer } from "mobx-react-lite"
import { fmtDt } from "../../utils/DateFormat"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import { AlternativeDTO } from "../../types/dto/SnippetDTO"


type Props = {
    alternative: AlternativeDTO | null,
}

const Alternative: FunctionComponent<Props> = observer(({alternative}: Props) => {
    const [isShowingComments, setIsShowingComments] = useState(false)
    const [isShowingInput, setIsShowingInput] = useState(false)

    const flipComments = () => {
        setIsShowingComments(!isShowingComments)
    }

    const flipReply = () => {
        setIsShowingInput(!isShowingInput)
    }

    const voteHandler = () => {
        console.log("vote handler")
    }
    const state = useContext<MainState>(StoreContext)
    const isLoggedIn = state.user.userStatus === "user"

    return html`                 
        <div class="alternativeItem">
            <div class="alternativeItemCode">
                    ${alternative !== null && alternative.code}                
            </div>
            <div class="alternativeItemHeader">
                <span>
                     Upload date: alternative.tsUpload
                </span>
                <span>
                    Votes: ${alternative !== null && alternative.score}
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
                    
                    
                    <div onClick=${flipReply}>
                        <span class="alternativeItemButton">A</span>Add a comment
                    </div>
                    ${(isLoggedIn === false && isShowingInput) && html`
                        Please log in to post comments
                    `}
                    ${(isLoggedIn === true && isShowingInput === true) && html`
                        <textarea></textarea>
                    `}
                    
                </div>
                `
            }
        </div>        
    `
})

export default Alternative