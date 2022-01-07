import "./Alternative.css"
import { html } from "htm/react"
import { useParams } from "react-router";
import { FunctionComponent, useContext, useEffect } from "react"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import IClient from "../../../ports/IClient"
import { fetchFromClient } from "../../utils/Client"
import { observer } from "mobx-react-lite"
import Alternative from "./Alternative"
import AlternativePrimary from "./AlternativePrimary"
import { AlternativeDTO } from "../../types/dto/SnippetDTO";


const AlternativePg: FunctionComponent = observer(({}: any) => {
    const { tlId, langId } = useParams<{ tlId: string, langId: string, }>()
    if (!tlId || !langId) return (html`<div></div>`)

    const tlIdNum: number = parseInt(tlId) || -1
    const langIdNum: number = parseInt(langId) || -1
    if (tlIdNum < 0 || langIdNum < 0) return (html`<div></div>`)
    const state = useContext<MainState>(StoreContext)
    const client: IClient = state.app.client
    const lang = state.app.languages.find(x => x.id === langIdNum) || null
        
    useEffect(() => {
        if (lang === null) {
            fetchFromClient(client.languagesReqGet(), state.app.languagesSet)
        }
        fetchFromClient(client.alternativesGet(tlIdNum), state.app.alternativesSet)
    }, [])
    
    const alternatives = state.app.alternatives.length > 0 ? state.app.alternatives[0] : null
    if (alternatives === null) return (html`<div></div>`)
    const primaryAlternative = alternatives.primary
    const nonPrimaryAlternatives = alternatives.rows
        
    return html`                         
        <div class="alternativeBody">
            <${AlternativePrimary} primaryAlternative=${primaryAlternative} key=${0} lang=${lang} />
            ${nonPrimaryAlternatives.map((alt: AlternativeDTO, idx: number ) => {
                return html`<${Alternative} key=${idx} alternative=${alt} />`
            })}
            <div class="alternativeFooter"></div>
        </div>        
    `
})

export default AlternativePg