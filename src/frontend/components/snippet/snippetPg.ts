import SnippetDTO from "../../../common/dto/SnippetDTO"
import Header from "./Header"
import TextInput from "./TextInput"
import "./snippet.css"
import SnippetCode from "./SnippetCode"
import { html } from "htm/react"
import { StoreContext } from "../../App"
import { FunctionComponent, useContext, useEffect} from "react"
import MainState from "../../mobX/MainState"
import { observer } from "mobx-react-lite"
import { fetchFromClient, fetchFromClientTransform } from "../../utils/Client"
import IClient from "../../interfaces/IClient"
import { groupLanguages, } from "../../utils/languageGroup/GroupLanguages"


const SnippetPg: FunctionComponent = observer(({}: any) => {
    console.log("SnippetPg!")
    const state = useContext<MainState>(StoreContext)
    const snippets = state.app.snippets
    const lang1 = state.app.language1
    const lang2 = state.app.language2
    const tg = state.app.taskGroup
    const client: IClient = state.app.client

    useEffect(() => {
        fetchFromClientTransform(client.getLanguages(), groupLanguages, state.app.setLanguageGroups)
        fetchFromClient(client.getTaskGroups(), state.app.setTaskGroups)
    }, [])

    useEffect(() => {
        fetchFromClient(client.getSnippets(lang1.id, lang2.id, tg.id), state.app.setSnippets)
    }, [lang1, lang2, tg])

    return html`<div class="snippetsBody">
        <${Header} />
        <main class="snippetsContainer">
            <div class="snippetsHeader">
                <div class="snippetLeftHeader">${lang1.name}</div>
                <div class="taskForHeader">${tg.name}</div>
                <div class="snippetRightHeader">${lang2.name}</div>
            </div>
            ${snippets && snippets.map((snippet: SnippetDTO, idx: number ) => {
                const evenClass = (idx%2 === 0 ? " evenRow" : "")
                return html`
                    <div class="snippetRow" key=${idx}>
                        <div class=${"snippetContent leftSide" + evenClass}>
                            ${snippet.leftCode.length > 0 
                                ? html`<${SnippetCode} content=${snippet.leftCode} isRight=${false}><//>`
                                : html`<${TextInput} numberProposals="4"><//>`}
                        </div>
                        <div class=${"taskContainer" + evenClass}>
                            ${snippet.taskName}
                        </div>
                        <div class=${"snippetContent rightSide" + evenClass}>
                            ${snippet.rightCode.length > 0 
                                ? html`<${SnippetCode} content=${snippet.rightCode} isRight=${true}><//>`
                                : html`<${TextInput} numberProposals="4"><//>`}
                        </div>
                    </div>`
            })}
            <div class="snippetFooter"> </div>
        </main>
    </div>
    `
})


export default SnippetPg