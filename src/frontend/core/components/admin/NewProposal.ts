import { FunctionComponent, useContext, useEffect } from "react"
import ProposalDTO from "../../types/dto/ProposalDTO"
import "./admin.css"
import { html } from "htm/react"
import { fetchFromClient } from "../../utils/Client"
import { observer } from "mobx-react-lite"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import IClient from "../../../ports/IClient"
import { fmtDt } from "../../utils/DateFormat"


const NewProposal: FunctionComponent = observer(() => {
    const state = useContext<MainState>(StoreContext)
    const client: IClient = state.app.client
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
        const accToken = state.user.accessToken
        const userId = state.user.userId
        if (userId < 0 || accToken === "") return
        client.proposalDecline(pId, {userId: userId, accessToken: accToken, })
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
                                ${proposal.taskName}
                            </div>
                            <div>
                                ${proposal.languageName}
                            </div>
                            <div>
                                ${proposal.author}
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
    `
})

export default NewProposal