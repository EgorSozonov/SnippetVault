import React, { FunctionComponent, useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import EditableList from '../../commonComponents/editableList/EditableList';
import HeaderRightButton from '../../commonComponents/headerRightButton/HeaderRightButton';
import Toggler from '../../commonComponents/toggler/Toggler';
import Proposal from '../../../common/dto/ProposalDTO';
import "./admin.css"
import { html } from 'htm/react'
import { fetchFromClient } from '../../utils/Client';
import { observer } from 'mobx-react-lite';
import MainState from '../../mobX/MainState';
import { StoreContext } from '../../App';
import IClient from '../../interfaces/IClient';
import { fmtDt } from '../../utils/DateFormat';


const NewProposal: FunctionComponent = observer(() => {
    const state = useContext<MainState>(StoreContext)
    const client: IClient = state.app.client
    useEffect(() => {
        fetchFromClient(client.getProposals(), state.app.setProposals)
    }, [])

    const approveHandler = (pId: number) => () => {
        console.log("approving proposal " + pId)
    }
    return html`
        <div class="newProposals">
            <div class="newProposalsTitle">
                <h3>New proposals</h3>
            </div>
            ${state.app.proposals.map((snippet: Proposal, idx: number ) => {
                return html`
                    <div class="proposalContainer" key=${idx}>
                        <div class=${"proposalHeaderContainer"}>

                            <div>
                                ${snippet.taskName}
                            </div>
                            <div>
                                ${fmtDt(snippet.tsUpload)}
                            </div>
                            <div class="proposalHeaderRight" title="Accept" onClick=${approveHandler(snippet.id)}>
                                A
                            </div>
                        </div>
                        <div class=${"proposalBody"}>${snippet.code}</div>
                    </div>`
            })}            
        </div>
    `
})

export default NewProposal