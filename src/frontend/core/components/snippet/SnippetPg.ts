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
import { groupLanguages, languageListOfGrouped, } from "../../utils/languageGroup/GroupLanguages"
import { checkNonempty } from "../../utils/StringUtils"
import { idOf, isStateOK, stringOf } from "../../types/SnippetState"
import EitherMsg from "../../types/EitherMsg"
import LanguageGroupedDTO from "../../types/dto/LanguageGroupedDTO"


const SnippetPg: FunctionComponent = observer(({}: any) => {
    const state = useContext<MainState>(StoreContext)
    const snippets = state.app.snippets
    const lang1 = state.app.l1
    const lang2 = state.app.l2
    const tg = state.app.tg

    const client: IClient = state.app.client

    const [searchParams, setSearchParams] = useSearchParams();   
    const lang1Code = searchParams.get("lang1")
    const lang2Code = searchParams.get("lang2")
    const taskCode = searchParams.get("task")
    const nonEmptyParams = checkNonempty([taskCode, lang1Code, lang2Code, ])
    

    // If all query params present and at least one of them doesn't match Redux, make a new request to server and update the Redux ids.
    // Otherwise, if all params are present in Redux, update the URL if it doesn't match.
    if (nonEmptyParams.length > 0) {
        state.app.setCodesFromUrl(nonEmptyParams[0], nonEmptyParams[1], nonEmptyParams[2])
    }
    

    useEffect(() => {
        console.log("eff 1");

        (async () => { 
            if (state.app.groupedLanguages.length > 0) return
            const resultLangs: EitherMsg<LanguageGroupedDTO[]> = await client.getLanguages() 
                if (resultLangs.isOK === true) {
                state.app.setGroupedLanguages(groupLanguages(resultLangs.value))
                const langList = languageListOfGrouped(resultLangs.value)
                state.app.setLanguageList(langList)
            } else {
                console.log(resultLangs.errMsg)
            }
        })()               

        if (state.app.taskGroups.length < 1) {
            fetchFromClient(client.getTaskGroups(), state.app.setTaskGroups)
        }
        if (isStateOK([tg, lang1, lang2])) {
            fetchFromClient(client.getSnippetsByCode(tg.code, lang1.code, lang2.code), state.app.setSnippets)
        }
    }, [])

    useEffect( () => {
        console.log("eff 2")

        if (isStateOK([tg, lang1, lang2])) {            
            setSearchParams(`lang1=${lang1.code}&lang2=${lang2.code}&task=${tg.code}`)
        }
    }, [lang1, lang2, tg])


    return html`<div class="snippetsBody">
        <${Header} />
        <main class="snippetsContainer">
            <div class="snippetsHeader">
                <div class="snippetLeftHeader">${stringOf(lang1)}</div>
                <div class="taskForHeader">${stringOf(tg)}</div>
                <div class="snippetRightHeader">${stringOf(lang2)}</div>
            </div>
            ${snippets && snippets.map((snippet: SnippetDTO, idx: number ) => {
                const evenClass = (idx%2 === 0 ? " evenRow" : "")
                return html`
                    <div class="snippetRow" key=${idx}>
                        <div class=${"snippetContent leftSide" + evenClass}>
                            ${snippet.leftCode.length > 0 
                                ? html`<${SnippetCode} content=${snippet.leftCode} isRight=${false} langId=${idOf(lang1)} taskId=${snippet.taskId}><//>`
                                : html`<${TextInput} taskId=${snippet.taskId} langId=${idOf(lang1)}  numberProposals="4"><//>`}
                        </div>
                        <div class=${"taskContainer" + evenClass}>
                            ${snippet.taskName}
                        </div>
                        <div class=${"snippetContent rightSide" + evenClass}>
                            ${snippet.rightCode.length > 0 
                                ? html`<${SnippetCode} content=${snippet.rightCode} isRight=${true} langId=${idOf(lang2)} taskId=${snippet.taskId}><//>`
                                : html`<${TextInput} taskId=${snippet.taskId} langId=${idOf(lang2)} numberProposals="4"><//>`}
                        </div>
                    </div>`
            })}
            <div class="snippetFooter"> </div>
        </main>
    </div>
    `
})


export default SnippetPg