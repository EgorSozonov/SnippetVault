import SnippetDTO from "../../../common/dto/SnippetDTO";
import "../snippet/snippet.css"
import { html } from "htm/react"


function Alternative() {
    return html`
        <div class="adminAlternative">
            
            <div class="snippetsContainer">
                <div class="snippetsHeader">
                    <div class="snippetLeftHeader">
                        Alternatives
                    </div>
                    <div class="taskForHeader"><Toggler leftChoice="Old->new" rightChoice="Highest votes first" initChosen={false}>
                                </Toggler></div>
                    <div class="snippetRightHeader">
                        &nbsp;
                    </div>
                </div>
                ${mockAlternatives.map((snippet: SnippetDTO, idx: number ) => {
                    const evenClass = (idx%2 === 0 ? " evenRow" : "")
                    return html`
                        <div class="snippetContainer" key={idx}>
                            <div class=${"snippet leftSide" + evenClass}>${snippet.leftCode}</div>
                            <div class=${"taskContainer" + evenClass}>
                                <div class="taskLeft">
                                </div>
                                <div class="task">${snippet.taskName}</div>
                                <div class="taskRight commentButton" title="Promote to main version">
                                    P
                                </div>
                            </div>
                            <div class=${"snippet rightSide" + evenClass}>${snippet.rightCode}</div>
                        </div>
                        `
                })}
                
            </div>

        </div>
    `
}

export default Alternative