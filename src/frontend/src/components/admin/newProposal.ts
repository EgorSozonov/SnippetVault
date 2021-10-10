import React from 'react'
import { NavLink } from 'react-router-dom';
import EditableList from '../../commonComponents/editableList/editableList';
import HeaderRightButton from '../../commonComponents/headerRightButton/headerRightButton';
import Toggler from '../../commonComponents/toggler/toggler';
import Proposal from '../../types/proposal';
import "../snippet/snippet.css"
import "./admin.css"
import { html } from 'htm/react'


const mockProposals: Proposal[] = [
]

function NewProposal() {
    return (
        <div className="newProposal">
            <div className="snippetsContainer">
                <div className="snippetsHeader">
                    <div className="snippetLeftHeader">&nbsp;</div>
                    <div className="taskForHeader"><Toggler leftChoice="Old->new" rightChoice="New->old" initChosen={false}>
                                </Toggler></div>
                    <div className="snippetRightHeader">
                        New Proposals
                    </div>
                </div>
                {mockProposals.map((snippet: Proposal, idx: number ) => {
                    const evenClass = (idx%2 === 0 ? " evenRow" : "")
                    return (<div className="snippetContainer" key={idx}>
                        <div className={"snippet leftSide" + evenClass} >{}</div>
                        <div className={"taskContainer" + evenClass}>
                            <div className="taskLeft">
                            </div>
                            <div className="task"><span>{snippet.TaskName}</span> <span>{snippet.TSUpload.toString()}</span></div>
                            <div className="taskRight commentButton" title="Accept">
                                A
                            </div>
                        </div>
                        <div className={"snippet rightSide" + evenClass}>{snippet.ProposalCode}</div>
                    </div>)
                })}
                
            </div>
        </div>
      );
}

export default NewProposal