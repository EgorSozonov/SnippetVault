import "./admin.css"
import React from "react"
import { FunctionComponent, useContext, useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"
import DialogState from "../../commonComponents/dialog/DialogState";
import MainState from "../../mobX/AllState";
import { StoreContext } from "../../App";
import DialogFullscreen from "../../commonComponents/dialog/DialogFullscreen";
import { ProposalUpdateDTO } from "../../types/dto/SnippetDTO";


type Props = {
    dialogState: DialogState,
    closeCallback: () => void,
}

const EditProposalDialog: FunctionComponent<Props> = observer(({ dialogState, closeCallback, }: Props) => {
    const state = useContext<MainState>(StoreContext)
    const proposal = state.admin.editProposal

    useEffect(() => {
        if (dialogState.isOpen === false) return

        state.admin.proposalGet(dialogState.id)
    }, [dialogState.isOpen])

    const inputRef = useRef<HTMLTextAreaElement>(null)
    const inputLibRef = useRef<HTMLTextAreaElement>(null)
    if (proposal !== null && inputRef !== null && inputRef.current !== null) {
        inputRef.current.value = proposal.content
        if (proposal.libraries && inputLibRef !== null && inputLibRef.current !== null) {
            inputLibRef.current.value = proposal.libraries
        }
    }

    const saveCommentHandler = () => {
        if (inputRef === null || !inputRef.current) return
        const text = inputRef.current.value.trim()
        if (text.trim().length < 1) return
        const headers = state.user.headersGet()
        if (headers === null) return

        const libraries = (inputLibRef !== null && inputLibRef.current !== null) ? inputLibRef.current?.value : undefined

        const dto: ProposalUpdateDTO = {content: text, existingId: dialogState.id, libraries: libraries, }
        state.admin.proposalUpdate(dto, headers)
        closeCallback()
    }

    return (
        <DialogFullscreen closeCallback={closeCallback} state={dialogState}>
            {(state.user.isAdmin.get() === true && proposal !== null) &&
                <>
                    <div>
                        <div className="adminProposalDialogTextareaContainer">
                            <textarea className="adminProposalDialogTextarea" ref={inputRef} />
                        </div>
                    </div>
                    <div className="adminProposalDialogTextareaContainer">
                        Libraries
                        <div className="adminProposalDialogTextareaContainer">
                            <textarea className="adminProposalDialogTextarea" ref={inputLibRef} />
                        </div>
                    </div>
                    <div className="adminProposalDialogButtons">
                        <div className="adminProposalDialogButton" onClick={closeCallback}>
                            Cancel
                        </div>
                        <div className="adminProposalDialogButton" onClick={saveCommentHandler}>
                            OK
                        </div>
                    </div>
                </>
            }
        </DialogFullscreen>
    )
})

export default EditProposalDialog
