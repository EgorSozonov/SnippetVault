import { FunctionComponent, useContext, useEffect, useState } from "react"
import "./admin.css"
import { html } from "htm/react"
import { observer } from "mobx-react-lite"
import MainState from "../../mobX/AllState"
import { StoreContext } from "../../App"
import DialogState from "../../commonComponents/dialog/DialogState"
import { ProposalDTO } from "../../types/dto/SnippetDTO"
import DialogConfirm from "../../commonComponents/dialog/DialogConfirm"
import EditProposalDialog from "./EditProposalDialog"


const NewProposal: FunctionComponent = observer(() => {
    const state = useContext<MainState>(StoreContext)

    const [confirmationDialog, setConfirmationDialog] = useState<DialogState>({id: 0, title: "", isOpen: false})
    const openConfirmationDialog = (id: number) => setConfirmationDialog({title: "Are you sure you want to decline this proposal?", id: id, isOpen: true})
    const cancelDialog = () => setConfirmationDialog({...confirmationDialog, isOpen: false})
    const okDialog = () => {
        setConfirmationDialog({...confirmationDialog, isOpen: false})
        const headers = state.user.headersGet()
        if (headers === null) return

        state.admin.proposalDecline(confirmationDialog.id, headers)
    }

    const [proposalDialog, setProposalDialog] = useState<DialogState>({id: 0, title: "", isOpen: false})
    const openProposalDialog = (id: number) => () => {
        setProposalDialog({title: "Edit proposal:", id: id, isOpen: true})
    }
    const closeProposalDialog = () => {
        setProposalDialog({...proposalDialog, isOpen: false})
        state.admin.proposalsGet()
    }

    useEffect(() => {
        state.admin.proposalsGet()
    }, [])

    const approveHandler = (pId: number) => () => {
        const headers = state.user.headersGet()
        if (headers === null) return

        state.admin.proposalApprove(pId, headers)
    }

    const declineHandler = (pId: number) => () => {
        openConfirmationDialog(pId)
    }

    const proposals = state.snip.proposals.slice()

    return ((proposalDialog.isOpen === false)
        ?  html`
            <div class="newProposals">
                <div class="newProposalsTitle">
                    <h3>New proposals</h3>
                </div>
                ${proposals.map((proposal: ProposalDTO, idx: number ) => {
                    return html`
                        <div class="proposalContainer" key=${idx}>
                            <div class=${"proposalHeaderContainer"}>
                                <div>
                                    ${proposal.taskName} | ${proposal.languageName} | ${proposal.author}
                                </div>

                                <div class="proposalHeaderRight" title="Accept">
                                    <div class="proposalHeaderButton" onClick=${declineHandler(proposal.proposalId)} title="Decline proposal">
                                        X
                                    </div>
                                    <div class="proposalHeaderButton" onClick=${openProposalDialog(proposal.proposalId)} title="Edit proposal">
                                        E
                                    </div>
                                    <div class="proposalHeaderButton" onClick=${approveHandler(proposal.proposalId)} title="Approve proposal">
                                        A
                                    </div>
                                </div>
                            </div>
                            <pre class=${"proposalBody"}>${proposal.proposalCode}</div>
                        </div>`
                })}
            </div>
            <${DialogConfirm} state=${confirmationDialog} okHandler=${okDialog} cancelHandler=${cancelDialog} />
        `
        : html`
            <${EditProposalDialog} dialogState=${proposalDialog} closeCallback=${closeProposalDialog} />
        `
    )
})

export default NewProposal
