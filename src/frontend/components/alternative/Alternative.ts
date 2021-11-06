import SnippetDTO from "../../../common/dto/SnippetDTO";
import "../snippet/snippet.css"
import { html } from "htm/react"
import { useParams } from "react-router";
import { useContext, useEffect } from "react";
import MainState from "../../mobX/MainState";
import { StoreContext } from "../../App";
import IClient from "../../interfaces/IClient";
import { fetchFromClient } from "../../utils/Client";
import AlternativeDTO from "../../../common/dto/AlternativeDTO";


function Alternative() {
    const { taskId, langId } = useParams<{taskId: string, langId: string}>()
    const taskIdNum: number = parseInt(taskId) || -1
    const langIdNum: number = parseInt(langId) || -1
    const state = useContext<MainState>(StoreContext)
    const client: IClient = state.app.client

    useEffect(() => {        
        fetchFromClient(client.getAlternatives(langIdNum, taskIdNum), state.app.setAlternatives)
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
                        <div>
                            Task: foo
                        </div>
                        <div>
                            Language: bar
                        </div>
                    </div>
                </div>
                ${state.app.alternatives.map((alt: AlternativeDTO, idx: number ) => {
                    const evenClass = (idx%2 === 0 ? " evenRow" : "")
                    return html`
                        <div class="snippetContainer" key={idx}>
                            <div class=${"snippet leftSide" + evenClass}>${alt.primaryCode}</div>
                            <div class=${"taskContainer" + evenClass}>
                                <div class="taskLeft">
                                </div>
                                <div class="task">${alt.tsUpload}</div>
                                <div class="taskRight commentButton" title="Promote to main version">
                                    P
                                </div>
                            </div>
                            <div class=${"snippet rightSide" + evenClass}>${alt.alternativeCode}</div>
                        </div>
                        `
                })}
                
            </div>

        </div>
    `
}

export default Alternative