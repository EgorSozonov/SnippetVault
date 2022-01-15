import "./Alternative.css"
import { html } from "htm/react"
import { FunctionComponent, useContext } from "react"
import { observer } from "mobx-react-lite"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import { AlternativeDTO } from "../dto/SnippetDTO"
import { VoteDTO } from "../dto/UserDTO"
import { fetchFromClient } from "../../utils/Client"
import { fmtDt } from "../../utils/DateUtils"


type Props = {
    alternative: AlternativeDTO,
    tlId: number,
    openDialog: (id: number, tlId: number, text: string) => () => void,
}

const Alternative: FunctionComponent<Props> = observer(({alternative, tlId, openDialog, }: Props) => {
    const state = useContext<MainState>(StoreContext)

    const voteHandler = (snId: number) => () => {
        const headers = state.user.headersGet()        
        if (headers === null) return

        const voteDTO: VoteDTO = {snId, tlId}
        state.app.client.userVote(voteDTO, headers)
            .then((r) => {
                if (r && r.status === "OK") {
                    fetchFromClient(state.app.client.alternativesForUserGet(tlId, headers.userId), state.app.alternativesSet)
                }
            })
    }

    const isSignedIn = state.user.isUser()

    return html`                 
        <div class="alternativeItem">
            <div class="alternativeItemCode">
                ${alternative.code}                
            </div>
            <div class="alternativeItemHeader">
                <span>
                    Upload date: ${fmtDt(alternative.tsUpload)}
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
                    : (isSignedIn === true &&
                        html`
                           <span class="alternativeFooterVote">
                                <span class="alternativeItemButton" onClick=${voteHandler(alternative.id)}>V</span>Vote
                            </span>
                        `)
                }                
            </div>            
            <div class="alternativeItemFooter">
                <span class="alternativeItemFooterComments" onClick=${openDialog(alternative.id, tlId, alternative.code)}>
                    <span class="alternativeItemButton" title="Comment">C</span> 
                    ${alternative.commentCount > 0 && 
                        (alternative.commentCount > 1 ? html`${alternative.commentCount} comments` : html`1 comment`)
                    }
                </span>    
            </div>            
        </div>        
    `
})

export default Alternative