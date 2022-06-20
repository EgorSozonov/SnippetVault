import "./Alternative.css"
import React from "react"
import { useParams } from "react-router";
import { FunctionComponent, useContext, useEffect, useState } from "react"
import MainState from "../../mobX/AllState"
import { storeContext } from "../../App"
import { observer } from "mobx-react-lite"
import Alternative from "./Alternative"
import AlternativePrimary from "./AlternativePrimary"
import { AlternativeDTO } from "../../types/dto/SnippetDTO";
import { empty } from "../../utils/ComponentUtils";
import { BigDialogState } from "../../commonComponents/dialog/DialogState";
import CommentDialog from "./CommentDialog";
import KeyButton from "../../commonComponents/login/KeyButton";
import UserButton from "../../commonComponents/login/UserButton";
import { NavLink } from "react-router-dom";
import PATHS from "../../Path";


const AlternativePg: FunctionComponent = observer(({}: any) => {
    const { langId, tlId } = useParams<{ tlId: string, langId: string, }>()
    if (!langId || !tlId) return empty

    const langIdNum: number = parseInt(langId) || -1
    const tlIdNum: number = parseInt(tlId) || -1

    if (langIdNum < 0 || tlIdNum < 0) return empty

    const state = useContext<MainState>(storeContext)
    const lang = state.snip.languages.find(x => x.id === langIdNum) || null

    const [commentDialog, setCommentDialog] = useState<BigDialogState>({id: -1, id2: -1, title: "", text: "", isOpen: false})
    const openDialog = (id: number, tlId: number, text: string) => () => setCommentDialog({
        title: "Comments for snippet", text, id: id, id2: tlId, isOpen: true,
    })
    const closeDialog = () => {
        state.user.commentsSet([])
        setCommentDialog({...commentDialog, isOpen: false})
    }

    useEffect(() => {
        state.user.trySignInFromLS()
        if (lang === null) {
            state.snip.languagesGet()
        }
        if (state.user.acc !== null) {
            state.snip.alternativesGetUser(tlIdNum, state.user.acc.userId)
        } else {
            state.snip.alternativesGet(tlIdNum)
        }
    }, [])

    const alternatives = state.snip.alternatives
    if (alternatives === null) return empty

    const primaryAlternative = alternatives.primary
    const nonPrimaryAlternatives = alternatives.rows

    return (
        commentDialog.isOpen === false
        ?   <>
                <div className="alternativeMargin" />
                <div className="alternativeBody">
                    <div className="alternativeHeaderTitle">
                        <span>Alternatives</span>
                        {state.user.acc === null ? <NavLink title="Sign in" to={PATHS["profile"].url}><KeyButton /></NavLink>
                                                  : <NavLink title="Profile" to={PATHS["profile"].url}><UserButton /></NavLink> }
                    </div>
                    <AlternativePrimary primaryAlternative={primaryAlternative} task={alternatives.task} tlId={tlIdNum} key={0} lang={lang} openDialog={openDialog} />
                    {nonPrimaryAlternatives.map((alt: AlternativeDTO, idx: number ) => {
                        return <Alternative key={idx} alternative={alt} tlId={tlIdNum} openDialog={openDialog} />
                    })}

                </div>
            </>
        : <CommentDialog dialogState={commentDialog} closeCallback={closeDialog} />
    )
})

export default AlternativePg
