import { FunctionComponent, useContext, useEffect, useState } from "react"
import "./admin.css"
import { html } from "htm/react"
import { fetchFromClient } from "../../utils/Client"
import { observer } from "mobx-react-lite"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import IClient from "../../../ports/IClient"
import { fmtDt } from "../../utils/DateUtils"
import Dialog from "../../commonComponents/dialog/Dialog"
import DialogState from "../../commonComponents/dialog/DialogState"
import { ProposalDTO } from "../../types/dto/SnippetDTO"
import DialogConfirm from "../../commonComponents/dialog/DialogConfirm"


const NewProposal: FunctionComponent = observer(() => {
    const state = useContext<MainState>(StoreContext)
    const client: IClient = state.app.client

    const [confirmationDialog, setConfirmationDialog] = useState<DialogState>({id: 0, title: "", isOpen: false})
    const openDialog = (id: number) => setConfirmationDialog({title: "Are you sure you want to decline this proposal?", id: id, isOpen: true})
    const cancelDialog = () => setConfirmationDialog({...confirmationDialog, isOpen: false})
    const okDialog = () => {
        setConfirmationDialog({...confirmationDialog, isOpen: false})
        const headers = state.user.headersGet()
        if (headers === null) return

        client.proposalDecline(confirmationDialog.id, headers)
            .then((r) => {
                if (r.status === "OK") {
                    fetchFromClient(client.proposalsGet(), state.app.proposalsSet)
                }
            })
    }

    useEffect(() => {
        fetchFromClient(client.proposalsGet(), state.app.proposalsSet)
    }, [])

    const approveHandler = (pId: number) => () => {
        const headers = state.user.headersGet()
        if (headers === null) return

        client.proposalApprove(pId, headers)
            .then((r) => {
                if (r.status === "OK") {
                    fetchFromClient(client.proposalsGet(), state.app.proposalsSet)
                }
            })
    }

    const declineHandler = (pId: number) => () => {
        openDialog(pId)
    }

    const editHandler = (pId: number) => () => {
        console.log("TODO edit proposal")
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
                                <div class="proposalHeaderButton" onClick=${editHandler(proposal.proposalId)} title="Edit proposal">
                                    E
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
        <${DialogConfirm} state=${confirmationDialog} okHandler=${okDialog} cancelHandler=${cancelDialog} />
    `
})

export default NewProposal