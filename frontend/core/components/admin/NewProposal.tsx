import { FunctionComponent, useContext, useEffect, useState } from "react"
import React from "react"
import "./admin.css"
import { observer } from "mobx-react-lite"
import MainState from "../../mobX/AllState"
import { storeContext } from "../../App"
import DialogState from "../../commonComponents/dialog/DialogState"
import { ProposalDTO } from "../../types/dto/SnippetDTO"
import DialogConfirm from "../../commonComponents/dialog/DialogConfirm"
import EditProposalDialog from "./EditProposalDialog"


const NewProposal: FunctionComponent = observer(() => {
    const state = useContext<MainState>(storeContext)

    const [confirmationDialog, setConfirmationDialog] = useState<DialogState>({id: 0, title: "", isOpen: false})
    const openConfirmationDialog = (id: number) => setConfirmationDialog({title: "Are you sure you want to decline this proposal?", id: id, isOpen: true})
    const cancelDialog = () => setConfirmationDialog({...confirmationDialog, isOpen: false})
    const okDialog = () => {
        setConfirmationDialog({...confirmationDialog, isOpen: false})
        const mbUserId = state.user.userNameGet()
        if (mbUserId === null) return

        state.admin.proposalDecline(confirmationDialog.id, mbUserId)
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
        const mbUserId = state.user.userNameGet()
        if (mbUserId === null) return

        state.admin.proposalApprove(pId, mbUserId)
    }

    const declineHandler = (pId: number) => () => {
        openConfirmationDialog(pId)
    }

    const proposals = state.admin.proposals.slice()
    return ((proposalDialog.isOpen === false)
        ? (<>
            <div className="newProposals">
                <div className="newProposalsTitle">
                    <h3>New proposals</h3>
                </div>
                {proposals.map((proposal: ProposalDTO, idx: number ) => {
                    return (
                        <div className="proposalContainer" key={idx}>
                            <div className={"proposalHeaderContainer"}>
                                <div>
                                    {proposal.taskName} | {proposal.languageName} | {proposal.author}
                                </div>

                                <div className="proposalHeaderRight" title="Accept">
                                    <div className="proposalHeaderButton" onClick={declineHandler(proposal.proposalId)} title="Decline proposal">
                                        X
                                    </div>
                                    <div className="proposalHeaderButton" onClick={openProposalDialog(proposal.proposalId)} title="Edit proposal">
                                        E
                                    </div>
                                    <div className="proposalHeaderButton" onClick={approveHandler(proposal.proposalId)} title="Approve proposal">
                                        A
                                    </div>
                                </div>
                            </div>
                            <pre className={"proposalBody"}>{proposal.content}</pre>
                        </div>
                    )
                })}
            </div>
            <DialogConfirm state={confirmationDialog} okHandler={okDialog} cancelHandler={cancelDialog}>

            </DialogConfirm>
            </>
        )
        : <EditProposalDialog dialogState={proposalDialog} closeCallback={closeProposalDialog} />

    )
})

export default NewProposal
