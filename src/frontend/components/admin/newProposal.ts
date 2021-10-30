import React from 'react'
import { NavLink } from 'react-router-dom';
import EditableList from '../../commonComponents/editableList/EditableList';
import HeaderRightButton from '../../commonComponents/headerRightButton/HeaderRightButton';
import Toggler from '../../commonComponents/toggler/Toggler';
import Proposal from '../../types/proposal';
import "../snippet/snippet.css"
import "./admin.css"
import { html } from 'htm/react'


const mockProposals: Proposal[] = [
]

function NewProposal() {
    return html`
        <div class="newProposal">
            <div class="snippetsContainer">
                <div class="snippetsHeader">
                    <div class="snippetLeftHeader">&nbsp;</div>
                    <div class="taskForHeader">
                        <${Toggler} leftChoice="Old->new" rightChoice="New->old" initChosen="false" />
                    </div>
                    <div class="snippetRightHeader">
                        New Proposals
                    </div>
                </div>
                ${mockProposals.map((snippet: Proposal, idx: number ) => {
                    const evenClass = (idx%2 === 0 ? " evenRow" : "")
                    return html`
                        <div class="snippetContainer" key=${idx}>
                            <div class=${"snippet leftSide" + evenClass} >{}</div>
                            <div class=${"taskContainer" + evenClass}>
                                <div class="taskLeft">
                                </div>
                                <div class="task">
                                    <span>${snippet.TaskName}</span> <span>${snippet.TSUpload.toString()}</span></div>
                                <div class="taskRight commentButton" title="Accept">
                                    A
                                </div>
                            </div>
                            <div class=${"snippet rightSide" + evenClass}>${snippet.ProposalCode}</div>
                        </div>`
                })}
                
            </div>
        </div>
    `
}

export default NewProposal