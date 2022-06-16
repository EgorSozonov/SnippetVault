import "./Alternative.css"
import React from "react"
import { FunctionComponent, useContext } from "react"
import { observer } from "mobx-react-lite"
import MainState from "../../mobX/AllState"
import { storeContext } from "../../App"
import { AlternativeDTO } from "../../types/dto/SnippetDTO"
import { VoteDTO } from "../../types/dto/UserDTO"
import { fmtDt } from "../../utils/DateUtils"


type Props = {
    alternative: AlternativeDTO,
    tlId: number,
    openDialog: (id: number, tlId: number, text: string) => () => void,
}

const Alternative: FunctionComponent<Props> = observer(({alternative, tlId, openDialog, }: Props) => {
    const state = useContext<MainState>(storeContext)

    const voteHandler = (snId: number) => () => {
        const headers = state.user.userIdGet()
        if (headers === null) return

        const voteDTO: VoteDTO = {snId, tlId}
        state.snip.userVote(voteDTO, headers)
    }

    const setPrimaryHandler = (tlId: number, snId: number) => () => {
        const headers = state.user.userIdGet()
        if (headers === null) return

        state.snip.snippetMarkPrimary(tlId, snId, headers)
    }

    const isSignedIn = state.user.isUser.get()
    const isAdmin = state.user.isAdmin.get()
    return (
        <div className="alternativeItem">
            <div className="alternativeItemCode">
                {alternative.content}
            </div>
            <div className="alternativeItemHeader">
                <span>
                    Upload date: {fmtDt(alternative.tsUpload)}
                </span>
                <span>
                    Votes: {alternative.score}
                </span>
                {alternative.voteFlag
                    ?
                        <span className="alternativeFooterVoted">
                            Voted!
                        </span>

                    :
                        (isSignedIn === true &&

                           <span className="alternativeFooterVote">
                                <span className="alternativeItemButton" onClick={voteHandler(alternative.id)}>V</span>Vote
                            </span>
                        )
                }
                {isAdmin &&
                    <span className="alternativeFooterPrimary" onClick={setPrimaryHandler(tlId, alternative.id)} title="Set as primary snippet">
                        <span className="alternativeItemButton">P</span>Primary
                    </span>
                }
            </div>
            <div className="alternativeItemFooter">
                <span className="alternativeItemFooterComments" onClick={openDialog(alternative.id, tlId, alternative.content)}>
                    <span className="alternativeItemButton" title="Comment">C</span>
                    {alternative.commentCount > 0 &&
                        (alternative.commentCount > 1 ? `${alternative.commentCount} comments` : `1 comment`)
                    }
                </span>
            </div>
        </div>
    )
})

export default Alternative
