import "./Alternative.css"
import { html } from "htm/react"
import { useParams } from "react-router";
import { FunctionComponent, useContext, useEffect, useState } from "react"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import IClient from "../../../ports/IClient"
import { fetchFromClient } from "../../utils/Client"
import { observer } from "mobx-react-lite"
import Alternative from "./Alternative"
import AlternativePrimary from "./AlternativePrimary"
import { AlternativeDTO } from "../../types/dto/SnippetDTO";
import { empty } from "../../utils/ComponentUtils";
import DialogChildren from "../../commonComponents/dialog/DialogChildren";
import DialogState from "../../commonComponents/dialog/DialogState";


const AlternativePg: FunctionComponent = observer(({}: any) => {
    const { langId, tlId } = useParams<{ tlId: string, langId: string, }>()
    if (!langId || !tlId) return empty

    const langIdNum: number = parseInt(langId) || -1
    const tlIdNum: number = parseInt(tlId) || -1    
    
    if (langIdNum < 0 || tlIdNum < 0) return empty

    const state = useContext<MainState>(StoreContext)
    const client: IClient = state.app.client
    const lang = state.app.languages.find(x => x.id === langIdNum) || null

    const [commentDialog, setCommentDialog] = useState<DialogState>({id: 0, title: "", isOpen: false})
    const openDialog = (id: number) => setCommentDialog({title: "Are you sure you want to decline this proposal?", id: id, isOpen: true})
    const cancelDialog = () => setCommentDialog({...commentDialog, isOpen: false})
    const okDialog = () => {
        setCommentDialog({...commentDialog, isOpen: false})
        const headers = state.user.headersGet()
        if (headers === null) return

        client.userComment(commentDialog.id, headers)
            .then((r) => {
                if (r.status === "OK") {
                    fetchFromClient(client.proposalsGet(), state.app.proposalsSet)
                }
            })
    }

    useEffect(() => {
        state.user.trySignInFromLS()
        if (lang === null) {
            fetchFromClient(client.languagesReqGet(), state.app.languagesSet)
        }
        if (state.user.acc !== null) {
            fetchFromClient(client.alternativesForUserGet(tlIdNum, state.user.acc.userId), state.app.alternativesSet)
        } else {
            fetchFromClient(client.alternativesGet(tlIdNum), state.app.alternativesSet)
        }        
    }, [])
    
    const alternatives = state.app.alternatives
    
    if (alternatives === null) return empty
    const primaryAlternative = alternatives.primary
    const nonPrimaryAlternatives = alternatives.rows
        
    return html`                         
        <div class="alternativeBody">
            <${AlternativePrimary} primaryAlternative=${primaryAlternative} task=${alternatives.task} tlId=${tlIdNum}  key=${0} lang=${lang} />
            ${nonPrimaryAlternatives.map((alt: AlternativeDTO, idx: number ) => {
                return html`<${Alternative} key=${idx} alternative=${alt} tlId=${tlIdNum} />`
            })}
            <div class="alternativeFooter"></div>
            <${DialogChildren} state=${confirmationDialog} okHandler=${okDialog} cancelHandler=${cancelDialog} />
        </div>        
    `
})

export default AlternativePg