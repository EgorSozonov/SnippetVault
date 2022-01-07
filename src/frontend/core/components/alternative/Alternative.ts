import "./Alternative.css"
import { html } from "htm/react"
import { FunctionComponent, useContext, useState } from "react"
import { observer } from "mobx-react-lite"
import { fmtDt } from "../../utils/DateFormat"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import { AlternativeDTO } from "../../types/dto/SnippetDTO"
import { VoteDTO } from "../../types/dto/UserDTO"
import { SignInSuccessDTO } from "../../types/dto/AuthDTO"
import { fetchFromClient } from "../../utils/Client"


type Props = {
    alternative: AlternativeDTO,
    tlId: number,
}

const Alternative: FunctionComponent<Props> = observer(({alternative, tlId, }: Props) => {
    const [isShowingComments, setIsShowingComments] = useState(false)
    const [isShowingInput, setIsShowingInput] = useState(false)
    const state = useContext<MainState>(StoreContext)
    const flipComments = () => {
        setIsShowingComments(!isShowingComments)
    }

    const flipReply = () => {
        setIsShowingInput(!isShowingInput)
    }

    const voteHandler = (snId: number) => () => {
        const headers: SignInSuccessDTO = {userId: state.user.userId, accessToken: state.user.accessToken, }
        
        if (headers.userId < 0) return
        const voteDTO: VoteDTO = {snId, tlId}
        state.app.client.userVote(voteDTO, headers)
            .then((r) => {
                if (r && r.status === "OK") {
                    fetchFromClient(state.app.client.alternativesForUserGet(tlId, headers.userId), state.app.alternativesSet)
                }
            })
    }

    const isLoggedIn = state.user.userStatus === "user"

    return html`                 
        <div class="alternativeItem">
            <div class="alternativeItemCode">
                    ${alternative.code}                
            </div>
            <div class="alternativeItemHeader">
                <span>
                     Upload date: alternative.tsUpload
                </span>
                <span>
                    Votes: ${alternative.score}
                </span>
                ${alternative.voteFlag 
                    ? html`
                            <span class="alternativeFooterVoted">
                                Voted!
                            </span>
                            
                        `
                    : html`
                           <span class="alternativeFooterVote" onClick=${voteHandler(alternative.id)}>
                                <span class="alternativeItemButton">V</span>Vote
                            </span>
                        `
                }
                
            </div>            
            <div class="alternativeItemFooter">                
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