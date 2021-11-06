import SnippetDTO from "../../../common/dto/SnippetDTO";
import "../snippet/snippet.css"
import { html } from "htm/react"
import mockData from "../../dataSource/mock/MockData";
import { useParams } from "react-router";
import { useContext, useEffect } from "react";
import MainState from "../../mobX/MainState";
import { StoreContext } from "../../App";
import IClient from "../../interfaces/IClient";
import { fetchFromClient } from "../../utils/Client";


function Alternative() {
    const { taskId, langId } = useParams<{taskId: string, langId: string}>()
    const taskIdNum: number = parseInt(taskId) || -1
    const langIdNum: number = parseInt(langId) || -1
    const state = useContext<MainState>(StoreContext)
    const client: IClient = state.app.client

    useEffect(() => {        
        fetchFromClient(client.getAlternatives(taskId, langId), state.app.setAlternatives)
    }, [])
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
                ${mockData.alternatives.map((snippet: SnippetDTO, idx: number ) => {
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