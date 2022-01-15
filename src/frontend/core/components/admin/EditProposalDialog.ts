import "./admin.css"
import { html } from "htm/react"
import { FunctionComponent, useContext, useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"
import DialogState from "../../commonComponents/dialog/DialogState";
import MainState from "../../mobX/MainState";
import { StoreContext } from "../../App";
import DialogFullscreen from "../../commonComponents/dialog/DialogFullscreen";
import { fetchFromClient } from "../../utils/Client"
import { ProposalUpdateDTO } from "../dto/SnippetDTO";


type Props = {  
    dialogState: DialogState,
    closeCallback: () => void,
}

const EditProposalDialog: FunctionComponent<Props> = observer(({ dialogState, closeCallback, }: Props) => {       
    const state = useContext<MainState>(StoreContext)
    const proposal = state.app.editProposal
    

    useEffect(() => {
        if (dialogState.isOpen === false) return

        fetchFromClient(state.app.client.proposalGet(dialogState.id), state.app.editProposalSet)
    }, [dialogState.isOpen])

    const inputRef = useRef<HTMLTextAreaElement>(null)
    if (proposal !== null && inputRef !== null && inputRef.current !== null) inputRef.current.value = proposal.content

    const saveCommentHandler = () => {
        if (inputRef === null || !inputRef.current) return
        const text = inputRef.current.value.trim()
        if (text.trim().length < 1) return
        const headers = state.user.headersGet()
        if (headers === null) return

        const dto: ProposalUpdateDTO = {content: text, existingId: dialogState.id, }
        state.app.client.proposalUpdate(dto, headers)
        closeCallback()
    }

    return html`
        <${DialogFullscreen} closeCallback=${closeCallback} state=${dialogState}>              
            ${state.user.isAdmin() === true && 
                html`
                <div>
                    <div class="adminProposalDialogTextareaContainer">
                        <textarea class="adminProposalDialogTextarea" ref=${inputRef} />
                    </div>
                </div>
                <div class="adminProposalDialogButtons">
                <div class="adminProposalDialogButton" onClick=${closeCallback}>
                    Cancel
                </div>
                <div class="adminProposalDialogButton" onClick=${saveCommentHandler}>
                    OK
                </div>
            </div>
                `
            }
        <//>
    `
})

export default EditProposalDialog