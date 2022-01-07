import { FunctionComponent, useContext, useEffect, useState } from "react"
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
import { ProposalDTO } from "../../types/dto/SnippetDTO"


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
            .then((r) => {
                console.log("response")
                console.log(r)
                if (r === "OK") {
                    fetchFromClient(client.getProposals(), state.app.setProposals)
                }
            })
    }

    useEffect(() => {
        fetchFromClient(client.getProposals(), state.app.setProposals)
    }, [])

    const approveHandler = (pId: number) => () => {
        const accToken = state.user.accessToken
        const userId = state.user.userId
        if (userId < 0 || accToken === "") return
        const headers = {userId: userId, accessToken: accToken, }
        client.proposalApprove(pId, headers)
            .then((r) => {
                console.log("response")
                console.log(r)
                if (r === "OK") {
                    fetchFromClient(client.getProposals(), state.app.setProposals)
                }
            })
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