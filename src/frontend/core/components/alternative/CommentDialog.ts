import "./Alternative.css"
import { html } from "htm/react"
import { FunctionComponent, useContext, useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"
import { fmtDt } from "../../utils/DateUtils";
import { CommentCUDTO, CommentDTO } from "../dto/UserDTO";
import { BigDialogState } from "../../commonComponents/dialog/DialogState";
import MainState from "../../mobX/MainState";
import { StoreContext } from "../../App";
import DialogFullscreen from "../../commonComponents/dialog/DialogFullscreen";
import { fetchFromClient } from "../../utils/Client";
import Login from "../../commonComponents/login/Login";


type Props = {  
    dialogState: BigDialogState,
    closeCallback: () => void,
}

const CommentDialog: FunctionComponent<Props> = observer(({ dialogState, closeCallback, }: Props) => {       
    const state = useContext<MainState>(StoreContext)

    useEffect(() => {
        if (dialogState.isOpen === false) return

        fetchFromClient(state.app.client.commentsGet(dialogState.id), state.app.commentsSet)
    }, [dialogState])

    const inputRef = useRef<HTMLTextAreaElement>(null)

    const saveCommentHandler = () => {
        if (inputRef === null || !inputRef.current) return
        const text = inputRef.current.value.trim()
        if (text.trim().length < 1) return
        const headers = state.user.headersGet()
        if (headers === null) return

        const dto: CommentCUDTO = {snId: dialogState.id, content: text}
        state.app.client.commentCreate(dto, headers)
            .then((r) => {
                if (r && r.status === "OK") {
                    fetchFromClient(state.app.client.alternativesForUserGet(dialogState.id2, headers.userId), state.app.alternativesSet)
                }
            })
        closeCallback()
    }


    return html`
        <${DialogFullscreen} closeCallback=${closeCallback} state=${dialogState}>
            <div class="alternativeItemCode">${dialogState.text}</div>
            <ol>
                ${state.app.comments.map((comm: CommentDTO, idx: number) => {
                    return html`<li key=${idx} class="alternativeItemCommentsComment">
                        <div class="alternativeItemCommentsHeader">
                            <span>
                                [${fmtDt(comm.tsUpload)}] <span class="alternativeItemCommentsSmall">by</span> <span class="alternativeDialogUsername">${comm.author}</span>
                            </span>
                        </div>
                        <div class="alternativeItemCommentsText">${comm.content}</div>
                    </li>
                    `
                })}
            </ol>
            ${state.user.isUser() === true && 
                html`
                    <div>
                        <div>Enter comment as <span class="alternativeDialogUsername">${state.user.acc!.name}</span>:
                        </div>
                        <div class="alternativeDialogTextareaContainer">
                            <textarea class="alternativeDialogTextarea" ref=${inputRef} />
                        </div>
                    </div>
                    <div class="alternativeDialogButtons">
                        <div class="alternativeDialogButton" onClick=${closeCallback}>
                            Cancel
                        </div>
                        <div class="alternativeDialogButton" onClick=${saveCommentHandler}>
                            OK
                        </div>
                    </div>
                `
            }
            ${state.user.isUser() === false && 
                html`<${Login} />`
            }
        <//>
    `
})

export default CommentDialog