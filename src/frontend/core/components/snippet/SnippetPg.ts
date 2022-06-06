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
import PATHS from "../../Path"
import KeyButton from "../../commonComponents/login/KeyButton"
import UserButton from "../../commonComponents/login/UserButton"
import HoverSelectCompact from "../../commonComponents/hoverSelect/HoverCompact"
import SelectChoice from "../../types/SelectChoice"
import SRPSession from "../../utils/SRPSession"
import { rfc5054 } from "../../utils/Constants"
import { cli } from "webpack"


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

    const isSignedIn = state.user.isUser.get()
    state.snip.codesFromUrlSet(taskCode, lang1Code, lang2Code)

    useEffect(() => {
        state.snip.languagesGet()
        state.snip.taskGroupsGet()
        state.user.trySignInFromLS()
    }, [])

    const language1Handler = (newValue: SelectChoice) => {
        const indLang = state.snip.languageChoices.findIndex(x => x.id === newValue.id)
        if (indLang < 0) return

        setSearchParams(`lang1=${state.snip.languageChoices[indLang].code}&lang2=${lang2Code}&task=${taskCode}`)
        state.snip.language1Chosen(newValue)
    }

    const language2Handler = (newValue: SelectChoice) => {
        const indLang = state.snip.languageChoices.findIndex(x => x.id === newValue.id)
        if (indLang < 0) return

        setSearchParams(`lang1=${lang1Code}&lang2=${state.snip.languageChoices[indLang].code}&task=${taskCode}`)
        state.snip.language2Chosen(newValue)
    }

    const taskGroupHandler = (newValue: SelectChoice) => {
        const indTg = state.snip.taskGroups.findIndex(x => x.id === newValue.id)
        if (indTg < 0) return

        setSearchParams(`lang1=${lang1Code}&lang2=${lang2Code}&task=${state.snip.taskGroups[indTg].code}`)
        state.snip.taskGroupChosen(newValue)
    }

    if (nonEmptyParams.length < 3 && isStateOK([tg, lang1, lang2]) === true) {
        setSearchParams(`lang1=${lang1.code}&lang2=${lang2.code}&task=${tg.code}`)
    }
    useEffect(() => {
        (async () => {
            if (nonEmptyParams.length === 3) {
                await state.snip.snippetsGetByCode(taskCode!!, lang1Code!!, lang2Code!!)
            }
        })()
    }, [lang1Code, lang2Code, taskCode])

    const proposalHandler = (snippet: SnippetDTO, isRight: boolean) => () => {
        if (isRight === true && lang2.type === "ChoicesLoaded") {
            setCurrLanguage({ lang: {id: lang2.id, name: lang2.name, }, taskId: snippet.taskId, })
        } else if (isRight === false && lang1.type === "ChoicesLoaded") {
            setCurrLanguage({ lang: {id: lang1.id, name: lang1.name, }, taskId: snippet.taskId, })
        }
        openProposalDialog()
    }

    const fooRegister = async () => {
        const userName = "Joe"
        const password = "a6SWy$U8s7Y"

        // generate the client session class from the client session factory closure
        const clientSRP = new SRPSession(rfc5054.N_base10, rfc5054.g_base10, rfc5054.k_base16)
        try {
            const salt = await clientSRP.generateRandomSalt()
            const verifier = await clientSRP.generateVerifier(salt, userName, password)
            console.log("salt = " + salt)
            const serverB = await state.client.userRegister(userName, salt, verifier)
            const mbAM1 = await clientSRP.step1(userName, password, salt, serverB)
            if (mbAM1.isOk === false) return
            const {A, M1} = mbAM1.value
            const M2 = await state.client.userSignIn(A, M1)
            const result2 = await clientSRP.step2(M2)
            if (result2.isOk === false) return

            const sessionKey = result2.value
            console.log("Session Key = " + sessionKey)

        } catch (e) {
            console.log(e)
        }

    }

    const fooSignin = async () => {
        const userName = "Joe"
        const password = "a6SWy$U8s7Y"

        // generate the client session class from the client session factory closure
        const clientSRP = new SRPSession(rfc5054.N_base10, rfc5054.g_base10, rfc5054.k_base16)
        try {

            const {salt, B} = await state.client.userHandshake(userName)
            console.log(salt)
            console.log("B = " + B)
            const mbAM1 = await clientSRP.step1(userName, password, salt, serverB)
            if (mbAM1.isOk === false) return
            const {A, M1} = mbAM1.value
            const M2 = await state.client.userSignIn(A, M1)
            const result2 = await clientSRP.step2(M2)
            if (result2.isOk === false) return

            const sessionKey = result2.value
            console.log("Session Key = " + sessionKey)
        } catch (e) {
            console.log(e)
        }

    }

    return html`<div class="snippetsBody">
        <main class="snippetsContainer">
            <div class="snippetsHeader">
                <div class="snippetLeftHeader">
                    <button onClick=${foo}>Testing</button>
                    <div class="snippetHeading">
                        <span>${stringOf(lang1)}</span>
                        <span>
                            ${state.snip.l1.type === "ChoicesLoaded" &&
                                html`<${HoverSelectCompact} currValue=${state.snip.l1} choices=${state.snip.l1.choices} uniqueName="Lang1Choice"
                                selectCallback=${language1Handler}><//>`
                            }
                        </span>
                    </div>
                </div>
                <div class="taskForHeader">${stringOf(tg)}
                    <div class="snippetHeading">
                        ${state.snip.tg.type === "ChoicesLoaded" &&
                            html`<${HoverSelectCompact} currValue=${state.snip.tg} choices=${state.snip.tg.choices} uniqueName="TaskGroupChoice"
                            selectCallback=${taskGroupHandler}><//>`
                        }
                    </div>
                </div>
                <div class="snippetRightHeader">
                    <div class="snippetHeading">
                        <span>${stringOf(lang2)}</span>
                        ${state.snip.l2.type === "ChoicesLoaded" &&
                            html`<${HoverSelectCompact} currValue=${state.snip.l2} choices=${state.snip.l2.choices} uniqueName="Lang2Choice"
                            selectCallback=${language2Handler}><//>`
                        }
                    </div>
                    <${NavLink} exact="true" title=${isSignedIn === true ? "Profile" : "Sign in"} to=${PATHS["profile"].url}>
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
                                ? html`<${SnippetCode} content=${snippet.leftCode} isRight=${false} langId=${idOf(lang1)} libraries=${snippet.leftLibraries} tlId=${snippet.leftTlId}><//>`
                                : html`<div class="snippetProposalButtonContainer"><div class="snippetProposalButton" onClick=${proposalHandler(snippet, false)}>Create proposal</div></div>`
                            }
                        </div>
                        <div class=${"taskContainer" + evenClass}>
                            ${snippet.taskName}
                        </div>
                        <div class=${"snippetContent rightSide" + evenClass}>
                            ${snippet.rightCode.length > 0
                                ? html`<${SnippetCode} content=${snippet.rightCode} isRight=${true} langId=${idOf(lang2)} libraries=${snippet.rightLibraries} tlId=${snippet.rightTlId}><//>`
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
