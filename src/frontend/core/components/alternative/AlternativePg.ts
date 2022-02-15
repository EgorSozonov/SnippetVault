import "./Alternative.css"
import { html } from "htm/react"
import { useParams } from "react-router";
import { FunctionComponent, useContext, useEffect, useState } from "react"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import IClient from "../../../ports/IClient"
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
import PATHS from "../../params/Path";


const AlternativePg: FunctionComponent = observer(({}: any) => {
    const { langId, tlId } = useParams<{ tlId: string, langId: string, }>()
    if (!langId || !tlId) return empty

    const langIdNum: number = parseInt(langId) || -1
    const tlIdNum: number = parseInt(tlId) || -1

    if (langIdNum < 0 || tlIdNum < 0) return empty

    const state = useContext<MainState>(StoreContext)
    const lang = state.app.languages.find(x => x.id === langIdNum) || null

    const [commentDialog, setCommentDialog] = useState<BigDialogState>({id: -1, id2: -1, title: "", text: "", isOpen: false})
    const openDialog = (id: number, tlId: number, text: string) => () => setCommentDialog({
        title: "Comments for snippet", text, id: id, id2: tlId, isOpen: true,
    })
    const closeDialog = () => {
        state.app.commentsSet([])
        setCommentDialog({...commentDialog, isOpen: false})
    }

    useEffect(() => {
        state.user.trySignInFromLS()
        if (lang === null) {
            state.app.languagesGet()
        }
        if (state.user.acc !== null) {
            state.app.alternativesGetUser(tlIdNum, state.user.acc.userId)
        } else {
            state.app.alternativesGet(tlIdNum)
        }
    }, [])

    const alternatives = state.app.alternatives

    if (alternatives === null) return empty
    const primaryAlternative = alternatives.primary
    const nonPrimaryAlternatives = alternatives.rows

    return commentDialog.isOpen === false
        ? html`
            <div class="alternativeMargin" />
            <div class="alternativeBody">
                <div class="alternativeHeaderTitle">
                    <span>Alternatives</span>
                    ${state.user.acc === null ? html`<${NavLink} exact to=${PATHS["profile"].url}}><${KeyButton} /><//>`
                                              : html`<${NavLink} exact to=${PATHS["profile"].url}><${UserButton} /><//>` }
                </div>
                <${AlternativePrimary} primaryAlternative=${primaryAlternative} task=${alternatives.task} tlId=${tlIdNum} key=${0} lang=${lang} openDialog=${openDialog} />
                ${nonPrimaryAlternatives.map((alt: AlternativeDTO, idx: number ) => {
                    return html`<${Alternative} key=${idx} alternative=${alt} tlId=${tlIdNum} openDialog=${openDialog} />`
                })}

            </div>
        `
        : html`
            <${CommentDialog} dialogState=${commentDialog} closeCallback=${closeDialog} />
        `
})

export default AlternativePg
