import Snippet from "../../types/snippet"
import Header from "./header"
import TextInput from "./textInput"
import "./snippet.css"
import SnippetCode from "./snippetCode"
import createClient from "../../client"
import { AxiosInstance } from "axios"
import { html } from "htm/react"
import { useContext, useState, useEffect, } from "preact/hooks"
import { observer } from "mobx-preact"
import { StoreContext } from "../../app"
import { FunctionalComponent, VNode } from "preact"


const SnippetPg0: FunctionalComponent = () => {
    console.log("SnippetPg")
    const appState = useContext(StoreContext)
    const [snippets, setSnippets] = useState<Snippet[]>([])
    const client: AxiosInstance = createClient()
    const lang1 = appState.app.language1
    const lang2 = appState.app.language2
    const tg = appState.app.taskGroup

    useEffect(() => {
        client.get(`{ENDPOINTS.get.snippet}${appState.app.language1}/${appState.app.language2}/${appState.app.taskGroup}`)
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
    }, [lang1, lang2, tg])



    return html`<div class="snippetsBody">
        <${Header} />
        <main class="snippetsContainer">
            <div class="snippetsHeader">
                <div class="snippetLeftHeader">${lang1}</div>
                <div class="taskForHeader">${tg}</div>
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
            <div class="snippetFooter"> </div>
        </main>
    </div>
    `
}

const SnippetPg = observer(SnippetPg0)
export default SnippetPg