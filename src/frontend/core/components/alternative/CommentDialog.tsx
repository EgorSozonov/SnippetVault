import "./Alternative.css"
import React from "react"
import { FunctionComponent, useContext, useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"
import { fmtDt } from "../../utils/DateUtils";
import { CommentCUDTO, CommentDTO } from "../../types/dto/UserDTO";
import { BigDialogState } from "../../commonComponents/dialog/DialogState";
import MainState from "../../mobX/AllState";
import { storeContext } from "../../App";
import DialogFullscreen from "../../commonComponents/dialog/DialogFullscreen";
import Login from "../../commonComponents/login/Login";


type Props = {
    dialogState: BigDialogState,
    closeCallback: () => void,
}

const CommentDialog: FunctionComponent<Props> = observer(({ dialogState, closeCallback, }: Props) => {
    const state = useContext<MainState>(storeContext)

    useEffect(() => {
        if (dialogState.isOpen === false) return

        state.snip.commentsGet(dialogState.id)
    }, [dialogState])

    const inputRef = useRef<HTMLTextAreaElement>(null)

    const saveCommentHandler = () => {
        if (inputRef === null || !inputRef.current) return
        const text = inputRef.current.value.trim()
        if (text.trim().length < 1) return
        const mbUserId = state.user.userIdGet()
        if (mbUserId === null) return

        const dto: CommentCUDTO = {snId: dialogState.id, content: text}

        state.snip.commentCreate(dto, mbUserId, dialogState.id2)
        closeCallback()
    }

    return (
        <DialogFullscreen closeCallback={closeCallback} state={dialogState}>
            <div className="alternativeItemCode">{dialogState.text}</div>
            <ol>
                {state.snip.comments.map((comm: CommentDTO, idx: number) => {
                    return <li key={idx} className="alternativeItemCommentsComment">
                        <div className="alternativeItemCommentsHeader">
                            <span>
                                [{fmtDt(comm.tsUpload)}] <span className="alternativeItemCommentsSmall">by</span> <span className="alternativeDialogUsername">{comm.author}</span>
                            </span>
                        </div>
                        <div className="alternativeItemCommentsText">{comm.content}</div>
                    </li>

                })}
            </ol>
            {state.user.isUser.get() === true &&
                <>
                    <div>
                        <div>Enter comment as <span className="alternativeDialogUsername">{state.user.acc!.name}</span>:
                        </div>
                        <div className="alternativeDialogTextareaContainer">
                            <textarea className="alternativeDialogTextarea" ref={inputRef} />
                        </div>
                    </div>
                    <div className="alternativeDialogButtons">
                        <div className="alternativeDialogButton" onClick={closeCallback}>
                            Cancel
                        </div>
                        <div className="alternativeDialogButton" onClick={saveCommentHandler}>
                            OK
                        </div>
                    </div>
                </>
            }
            {state.user.isUser.get() === false &&
                <Login />
            }
        </DialogFullscreen>
    )
})

export default CommentDialog
