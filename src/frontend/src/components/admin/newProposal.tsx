import React from 'react'
import { NavLink } from 'react-router-dom';
import EditableList from '../../commonComponents/editableList/editableList';
import HeaderRightButton from '../../commonComponents/headerRightButton/headerRightButton';
import Toggler from '../../commonComponents/toggler/toggler';
import Proposal from '../../types/proposal';
import "../snippet/snippet.css"
import "./admin.css"

const mockProposals: Proposal[] = [
    {
        leftCode: "str3 = str1.replace(str2, \"bcjk\");", 
        proposalCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", langId: 2, 
        taskId: 1, taskName: "C#: Replace substring", date: new Date(),
    },
    {
        leftCode: "DirectoryInfo dirInfo = new DirectoryInfo(thePath);\n"
            + "fInfos = dirInfo.GetFileSystemInfos(\"*.CSV\");\n"
            + "foreach (FileSystemInfo it in fInfos) {\n"
            + "if (it is FileInfo) {\n"
            + "fNames[i, 0] = it.Name;\n"
            + "fNames[i, 1] = dirInfo.FullName;\n"
            + "fDates[i, 0] = it.LastWriteTime;\n"
            + "}\n"
            + "}", langId: 1,
            proposalCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", 
        taskId: 2, taskName: "Java: Get last modified times", date: new Date(),
    },
    
    {
        leftCode: "str3 = str1.replace(str2, \"bcjk\");", langId: 1,
        proposalCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", 
        taskId: 3, taskName: "Python: Index of first occurrence of substring", date: new Date(),
    },
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
                        <div className={"snippet leftSide" + evenClass} >{snippet.leftCode}</div>
                        <div className={"taskContainer" + evenClass}>
                            <div className="taskLeft">
                            </div>
                            <div className="task"><span>{snippet.taskName}</span> <span>{snippet.date.toString()}</span></div>
                            <div className="taskRight commentButton" title="Accept">
                                A
                            </div>
                        </div>
                        <div className={"snippet rightSide" + evenClass}>{snippet.proposalCode}</div>
                    </div>)
                })}
                
            </div>
        </div>
      );
}

export default NewProposal