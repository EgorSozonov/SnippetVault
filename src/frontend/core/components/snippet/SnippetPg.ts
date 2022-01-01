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
import { checkNonempty } from "../../utils/StringUtils"


const SnippetPg: FunctionComponent = observer(({}: any) => {
    const state = useContext<MainState>(StoreContext)
    const snippets = state.app.snippets
    const lang1 = state.app.language1
    const lang2 = state.app.language2
    const tg = state.app.taskGroup
    //const codes = state.app.codesFromUrl

    const client: IClient = state.app.client

    const [searchParams, setSearchParams] = useSearchParams();   
    const lang1Code = searchParams.get("lang1")
    const lang2Code = searchParams.get("lang2")
    const taskCode = searchParams.get("task")    
    const nonEmptyParams = checkNonempty([taskCode, lang1Code, lang2Code, ])
    

    // If all query params present and at least one of them doesn't match Redux, make a new request to server and update the Redux ids.
    // Otherwise, if all params are present in Redux, update the URL if it doesn't match.
    if (nonEmptyParams.length > 0) {
          console.log("p1")
        const newCodeFromUrl = {tg: nonEmptyParams[0], lang1: nonEmptyParams[1], lang2: nonEmptyParams[2], }
        state.app.setCodesFromUrl(newCodeFromUrl)
    } else if (nonEmptyParams.length < 3 && lang1.id > 0 && lang2.id > 0 && tg.id > 0) {
        console.log("p2")
        state.app.refreshCodesFromSelects()
        setSearchParams(`lang1=${lang1.code}&lang2=${lang2.code}&task=${tg.code}`)
    }
    

    useEffect(() => {
        fetchFromClientTransform(client.getLanguages(), groupLanguages, state.app.setGroupedLanguages)
        fetchFromClient(client.getTaskGroups(), state.app.setTaskGroups)
        if (nonEmptyParams.length > 0) {
            fetchFromClient(client.getSnippetsByCode(nonEmptyParams[0], nonEmptyParams[1], nonEmptyParams[2]), state.app.setSnippets)
        }
    }, [])


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