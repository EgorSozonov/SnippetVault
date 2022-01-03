import { FunctionComponent, useContext, useEffect, useState } from "react"
import ProposalDTO from "../../types/dto/ProposalDTO"
import "./admin.css"
import { html } from "htm/react"
import { fetchFromClient } from "../../utils/Client"
import { observer } from "mobx-react-lite"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import IClient from "../../../ports/IClient"
import { fmtDt } from "../../utils/DateFormat"
import Dialog from "../../commonComponents/dialog/Dialog"
import DialogState from "../../commonComponents/dialog/DialogState"


const NewProposal: FunctionComponent = observer(() => {
    const state = useContext<MainState>(StoreContext)
    const client: IClient = state.app.client

    const [confirmationDialog, setConfirmationDialog] = useState<DialogState>({id: 0, title: "", isOpen: false})
    const openDialog = (id: number) => setConfirmationDialog({title: "Are you sure you want to decline this proposal?", id: id, isOpen: true})
    const cancelDialog = () => setConfirmationDialog({...confirmationDialog, isOpen: false})
    const okDialog = () => {
        setConfirmationDialog({...confirmationDialog, isOpen: false})
        const accToken = state.user.accessToken
        const userId = state.user.userId
        if (userId < 0 || accToken === "") return
        client.proposalDecline(confirmationDialog.id, {userId: userId, accessToken: accToken, })
    }

    useEffect(() => {
        fetchFromClient(client.getProposals(), state.app.setProposals)
    }, [])

    const approveHandler = (pId: number) => () => {
        const accToken = state.user.accessToken
        const userId = state.user.userId
        if (userId < 0 || accToken === "") return
        client.proposalApprove(pId, {userId: userId, accessToken: accToken, })
    }

    const declineHandler = (pId: number) => () => {
        openDialog(pId)
    }
    
    return html`
        <div class="newProposals">
            <div class="newProposalsTitle">
                <h3>New proposals</h3>
            </div>
            ${state.app.proposals.map((proposal: ProposalDTO, idx: number ) => {
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
                                <div class="proposalHeaderButton" onClick=${approveHandler(proposal.proposalId)} title="Approve proposal">
                                A
                                </div>
                            </div>
                        </div>
                        <div class=${"proposalBody"}>${proposal.proposalCode}</div>
                    </div>`
            })}
            
        </div>
        <${Dialog} state=${confirmationDialog} okHandler=${okDialog} cancelHandler=${cancelDialog} />
    `
})

export default NewProposal