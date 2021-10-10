import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import HoverSelect from '../../commonComponents/hoverSelect/hoverSelect';
import Toggler from '../../commonComponents/toggler/toggler';
import { SVState } from '../../redux/state';
import Snippet from '../../types/snippet';
import Header from './header'
import TextInput from "./textInput"
import './snippet.css'
import SnippetCode from './snippetCode';
import ENDPOINTS from '../../url';
import createClient from '../../client';
import { AxiosInstance } from 'axios';
import { html } from 'htm/react'


function SnippetPg() {
    console.log("SnippetPg")
    const lang1 = useSelector((state: SVState) => state.language1)
    const lang2 = useSelector((state: SVState) => state.language2)
    const taskGroup = useSelector((state: SVState) => state.taskGroup)
    const [snippets, setSnippets] = useState<Snippet[]>([])
    const client: AxiosInstance = createClient()
    useEffect(() => {
        client.get(`{ENDPOINTS.get.snippet}${lang1}/${lang2}/${taskGroup}`)
        .then((r: any) => {
            console.log("Response")
            console.dir(r)
            if (r.data) {
                setSnippets(r.data)
            }
        }).catch((e: any) => {
            console.log("Error")
            console.dir(e)
        })
    }, [lang1, lang2, taskGroup])



    return html`<div class="snippetsBody">
        <${Header} />
        <main class="snippetsContainer">
            <div class="snippetsHeader">
                <div class="snippetLeftHeader">${lang1}</div>
                <div class="taskForHeader">${taskGroup}</div>
                <div class="snippetRightHeader">${lang2}</div>
            </div>
            ${snippets && snippets.map((snippet: Snippet, idx: number ) => {
                const evenClass = (idx%2 === 0 ? " evenRow" : "")
                return html`
                    <div class="snippetRow" key=${idx}>
                        <div class=${"snippetContent leftSide" + evenClass}>
                            ${snippet.leftCode.length > 0 
                                ? html`<${SnippetCode} content=${snippet.leftCode} isRight="false"><//>`
                                : html`<${TextInput} numberProposals="4"><//>`}
                        </div>
                        <div class=${"taskContainer" + evenClass}>
                            ${snippet.taskName}
                        </div>
                        <div class=${"snippetContent rightSide" + evenClass}>
                            ${snippet.rightCode.length > 0 
                                ? html`<${SnippetCode} content=${snippet.rightCode} isRight={true}><//>`
                                : html`<${TextInput} numberProposals="4"><//>`}
                        </div>
                    </div>`
            })}
            <div style="margin-bottom: 20px; background-color: #303030'">&nbsp;</div>
        </main>
    </div>
    `
}

export default SnippetPg