import React from "react"
import "./snippet.css"
import SnippetCode from "./SnippetCode"
import { storeContext } from "../../App"
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


const SnippetPg: FunctionComponent = observer(({}: any) => {
    const state = useContext<MainState>(storeContext)
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

        setSearchParams(`lang1={state.snip.languageChoices[indLang].code}&lang2={lang2Code}&task={taskCode}`)
        state.snip.language1Chosen(newValue)
    }

    const language2Handler = (newValue: SelectChoice) => {
        const indLang = state.snip.languageChoices.findIndex(x => x.id === newValue.id)
        if (indLang < 0) return

        setSearchParams(`lang1={lang1Code}&lang2={state.snip.languageChoices[indLang].code}&task={taskCode}`)
        state.snip.language2Chosen(newValue)
    }

    const taskGroupHandler = (newValue: SelectChoice) => {
        const indTg = state.snip.taskGroups.findIndex(x => x.id === newValue.id)
        if (indTg < 0) return

        setSearchParams(`lang1={lang1Code}&lang2={lang2Code}&task={state.snip.taskGroups[indTg].code}`)
        state.snip.taskGroupChosen(newValue)
    }

    if (nonEmptyParams.length < 3 && isStateOK([tg, lang1, lang2]) === true) {
        setSearchParams(`lang1={lang1.code}&lang2={lang2.code}&task={tg.code}`)
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

    return (
    <div className="snippetsBody">
        <main className="snippetsContainer">
            <div className="snippetsHeader">
                <div className="snippetLeftHeader">
                    <div className="snippetHeading">
                        <span>{stringOf(lang1)}</span>
                        <span>
                            {state.snip.l1.type === "ChoicesLoaded" &&
                                <HoverSelectCompact currValue={state.snip.l1} choices={state.snip.l1.choices} uniqueName="Lang1Choice"
                                selectCallback={language1Handler} />
                            }
                        </span>
                    </div>
                </div>
                <div className="taskForHeader">{stringOf(tg)}
                    <div className="snippetHeading">
                        {state.snip.tg.type === "ChoicesLoaded" &&
                            <HoverSelectCompact currValue={state.snip.tg} choices={state.snip.tg.choices} uniqueName="TaskGroupChoice"
                            selectCallback={taskGroupHandler} />
                        }
                    </div>
                </div>
                <div className="snippetRightHeader">
                    <div className="snippetHeading">
                        <span>{stringOf(lang2)}</span>
                        {state.snip.l2.type === "ChoicesLoaded" &&
                            <HoverSelectCompact currValue={state.snip.l2} choices={state.snip.l2.choices} uniqueName="Lang2Choice"
                            selectCallback={language2Handler} />
                        }
                    </div>
                    <NavLink title={isSignedIn === true ? "Profile" : "Sign in"} to={PATHS["profile"].url}>
                        {isSignedIn === true ? <UserButton /> : <KeyButton /> }
                    </NavLink>
                </div>
            </div>
            {snippets && snippets.map((snippet: SnippetDTO, idx: number ) => {
                const evenClass = (idx%2 === 0 ? " evenRow" : "")
                return (
                    <div className="snippetRow" key={idx}>
                        <div className={"snippetContent leftSide" + evenClass}>
                            {snippet.leftCode.length > 0
                                ? <SnippetCode content={snippet.leftCode} isRight={false} langId={idOf(lang1)} libraries={snippet.leftLibraries} tlId={snippet.leftTlId} />
                                : <div className="snippetProposalButtonContainer"><div className="snippetProposalButton" onClick={proposalHandler(snippet, false)}>Create proposal</div></div>
                            }
                        </div>
                        <div className={"taskContainer" + evenClass}>
                            {snippet.taskName}
                        </div>
                        <div className={"snippetContent rightSide" + evenClass}>
                            {snippet.rightCode.length > 0
                                ? <SnippetCode content={snippet.rightCode} isRight={true} langId={idOf(lang2)} libraries={snippet.rightLibraries} tlId={snippet.rightTlId} />
                                : <div className="snippetProposalButtonContainer"><div className="snippetProposalButton" onClick={proposalHandler(snippet, true)}>Create proposal</div></div>
                            }
                        </div>
                    </div>
                )
            })}
            <div className="snippetFooter"> </div>
            {currLanguage !== null &&

                    <Dialog state={proposalDialog} closeCallback={closeProposalDialog}>
                        <ProposalInput lang={currLanguage.lang} taskOrId={{ type: "taskId", payload: currLanguage.taskId, }}
                                        closeCallback={closeProposalDialog} />
                    </Dialog>

            }
        </main>
    </div>
    )
})


export default SnippetPg
