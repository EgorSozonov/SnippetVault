import SnippetDTO from "../../types/dto/SnippetDTO"
import Header from "./Header"
import TextInput from "./TextInput"
import "./snippet.css"
import SnippetCode from "./SnippetCode"
import { html } from "htm/react"
import { StoreContext } from "../../App"
import { FunctionComponent, useContext, useEffect,} from "react"
import { useSearchParams } from "react-router-dom"
import MainState from "../../mobX/MainState"
import { observer } from "mobx-react-lite"
import { fetchFromClient, fetchFromClientTransform } from "../../utils/Client"
import IClient from "../../../ports/IClient"
import { groupLanguages, } from "../../utils/languageGroup/GroupLanguages"


const SnippetPg: FunctionComponent = observer(({}: any) => {
    const state = useContext<MainState>(StoreContext)
    const snippets = state.app.snippets
    const lang1 = state.app.language1
    const lang2 = state.app.language2
    const tg = state.app.taskGroup
    const client: IClient = state.app.client

    const [searchParams, setSearchParams] = useSearchParams();

    const lang1Code = searchParams.get('lang1')
    const lang2IdStr = searchParams.get('lang2')
    const taskIdStr = searchParams.get('task')
    // If all query params present and at least one of them doesn't match Redux, make a new request to server
    // Otherwise, if all params are present in Redux, make a new request to server and update the URL if it doesn't match

    useEffect(() => {
        fetchFromClientTransform(client.getLanguages(), groupLanguages, state.app.setGroupedLanguages)
        fetchFromClient(client.getTaskGroups(), state.app.setTaskGroups)
    }, [])

    useEffect(() => {
        const snippets = client.getSnippets(lang1.id, lang2.id, tg.id)
        fetchFromClient(snippets, state.app.setSnippets)
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
                                ? html`<${SnippetCode} content=${snippet.leftCode} isRight=${false} langId=${lang1.id} taskId=${snippet.taskId}><//>`
                                : html`<${TextInput} taskId=${snippet.taskId} langId=${lang1.id}  numberProposals="4"><//>`}
                        </div>
                        <div class=${"taskContainer" + evenClass}>
                            ${snippet.taskName}
                        </div>
                        <div class=${"snippetContent rightSide" + evenClass}>
                            ${snippet.rightCode.length > 0 
                                ? html`<${SnippetCode} content=${snippet.rightCode} isRight=${true} langId=${lang2.id} taskId=${snippet.taskId}><//>`
                                : html`<${TextInput} taskId=${snippet.taskId} langId=${lang2.id} numberProposals="4"><//>`}
                        </div>
                    </div>`
            })}
            <div class="snippetFooter"> </div>
        </main>
    </div>
    `
})


export default SnippetPg