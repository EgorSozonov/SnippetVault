import "./snippet.css"
import SnippetCode from "./SnippetCode"
import { html } from "htm/react"
import { StoreContext } from "../../App"
import { FunctionComponent, useContext, useEffect, useState,} from "react"
import { NavLink, useSearchParams } from "react-router-dom"
import MainState from "../../mobX/AllState"
import { observer } from "mobx-react-lite"
import { checkNonempty } from "../../utils/StringUtils"
import { idOf, isStateOK, stringOf } from "./utils/SnippetState"
import { SnippetDTO } from "../../types/dto/SnippetDTO"
import Dialog from "../../commonComponents/dialog/Dialog"
import ProposalInput from "../proposalInput/ProposalInput"
import DialogState from "../../commonComponents/dialog/DialogState"
import { CurrentLanguage } from "./types/CurrentLanguage"
import PATHS from "../../params/Path"
import KeyButton from "../../commonComponents/login/KeyButton"
import UserButton from "../../commonComponents/login/UserButton"
import HoverSelectCompact from "../../commonComponents/hoverSelect/HoverSelectCompact"


const SnippetPg: FunctionComponent = observer(({}: any) => {
    const state = useContext<MainState>(StoreContext)
    const snippets = state.snip.snippets
    const lang1 = state.snip.l1
    const lang2 = state.snip.l2
    const tg = state.snip.tg

    const [currLanguage, setCurrLanguage] = useState<CurrentLanguage | null>(null)
    const [proposalDialog, setProposalDialog] = useState<DialogState>({ isOpen: false, id: -1, title: "Post a proposal", })
    const openProposalDialog = () => setProposalDialog({ ...proposalDialog, isOpen: true })
    const closeProposalDialog = () => setProposalDialog({ ...proposalDialog, isOpen: false, })

    const [searchParams, setSearchParams] = useSearchParams();
    const lang1Code = searchParams.get("lang1")
    const lang2Code = searchParams.get("lang2")
    const taskCode = searchParams.get("task")
    const nonEmptyParams = checkNonempty([taskCode, lang1Code, lang2Code, ])

    // If all query params present and at least one of them doesn't match Redux, make a new request to server and update the Redux ids.
    // Otherwise, if all params are present in Redux, update the URL if it doesn't match.
    if (nonEmptyParams.length > 0) {
        state.snip.codesFromUrlSet(nonEmptyParams[0], nonEmptyParams[1], nonEmptyParams[2])
    }

    const isSignedIn = state.user.isUser()

    useEffect(() => {
        state.snip.languagesGet()
        state.snip.taskGroupsGet()
        state.user.trySignInFromLS()
    }, [])

    useEffect( () => {
        if (isStateOK([tg, lang1, lang2])) {
            setSearchParams(`lang1=${lang1.code}&lang2=${lang2.code}&task=${tg.code}`)
            state.snip.snippetsGetByCode(tg.code, lang1.code, lang2.code)
        }
    }, [lang1, lang2, tg])

    const proposalHandler = (snippet: SnippetDTO, isRight: boolean) => () => {
        if (isRight === true && lang2.type === "ChoicesLoaded") {
            setCurrLanguage({ lang: {id: lang2.id, name: lang2.name, }, taskId: snippet.taskId, })
        } else if (isRight === false && lang1.type === "ChoicesLoaded") {
            setCurrLanguage({ lang: {id: lang1.id, name: lang1.name, }, taskId: snippet.taskId, })
        }
        openProposalDialog()
    }

    return html`<div class="snippetsBody">
        <main class="snippetsContainer">
            <div class="snippetsHeader">
                <div class="snippetLeftHeader">${stringOf(lang1)}
                    ${state.snip.l1.type === "ChoicesLoaded" &&
                        html`<${HoverSelectCompact} currValue=${state.snip.l1} choices=${state.snip.l1.choices} uniqueName="Lang1Choice"
                        selectCallback=${state.snip.language1Set}><//>`
                    }
                </div>
                <div class="taskForHeader">${stringOf(tg)}
                    ${state.snip.tg.type === "ChoicesLoaded" &&
                        html`<${HoverSelectCompact} currValue=${state.snip.tg} choices=${state.snip.tg.choices} uniqueName="TaskGroupChoice"
                        selectCallback=${state.snip.taskGroupSet}><//>`
                    }
                </div>
                <div class="snippetRightHeader">
                    <span>${stringOf(lang2)}</span>
                    ${state.snip.l2.type === "ChoicesLoaded" &&
                        html`<${HoverSelectCompact} currValue=${state.snip.l2} choices=${state.snip.l2.choices} uniqueName="Lang2Choice"
                        selectCallback=${state.snip.language2Set}><//>`
                    }
                    <${NavLink} exact to=${PATHS["profile"].url}>
                        ${isSignedIn === true ? html`<${UserButton} />` : html`<${KeyButton} />` }
                    <//>
                </div>
            </div>
            <div>


            </div>
            ${snippets && snippets.map((snippet: SnippetDTO, idx: number ) => {
                const evenClass = (idx%2 === 0 ? " evenRow" : "")
                return html`
                    <div class="snippetRow" key=${idx}>
                        <div class=${"snippetContent leftSide" + evenClass}>
                            ${snippet.leftCode.length > 0
                                ? html`<${SnippetCode} content=${snippet.leftCode} isRight=${false} langId=${idOf(lang1)} tlId=${snippet.leftTlId}><//>`
                                : html`<div class="snippetProposalButtonContainer"><div class="snippetProposalButton" onClick=${proposalHandler(snippet, false)}>Create proposal</div></div>`
                            }
                        </div>
                        <div class=${"taskContainer" + evenClass}>
                            ${snippet.taskName}
                        </div>
                        <div class=${"snippetContent rightSide" + evenClass}>
                            ${snippet.rightCode.length > 0
                                ? html`<${SnippetCode} content=${snippet.rightCode} isRight=${true} langId=${idOf(lang2)} tlId=${snippet.rightTlId}><//>`
                                : html`<div class="snippetProposalButtonContainer"><div class="snippetProposalButton" onClick=${proposalHandler(snippet, true)}>Create proposal</div></div>`
                            }
                        </div>
                    </div>`
            })}
            <div class="snippetFooter"> </div>
            ${currLanguage !== null &&
                html`
                    <${Dialog} state=${proposalDialog} closeCallback=${closeProposalDialog}>
                        <${ProposalInput} lang=${currLanguage.lang} taskOrId=${{ type: "taskId", payload: currLanguage.taskId, }}
                                        closeCallback=${closeProposalDialog} />
                    <//>
                `
            }
        </main>
    </div>
    `
})


export default SnippetPg
