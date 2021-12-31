import "./Alternative.css"
import { html } from "htm/react"
import { useParams } from "react-router";
import { FunctionComponent, useContext, useEffect } from "react"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import IClient from "../../../ports/IClient"
import { fetchFromClient } from "../../utils/Client"
import AlternativeDTO from "../../types/dto/AlternativeDTO"
import { observer } from "mobx-react-lite"
import Alternative from "./Alternative"
import AlternativePrimary from "./AlternativePrimary"


const AlternativePg: FunctionComponent = observer(({}: any) => {
    const { tlId, langId } = useParams<{ tlId: string, langId: string, }>()
    if (!tlId || !langId) return (html`<></>`)

    const tlIdNum: number = parseInt(tlId) || -1
    const langIdNum: number = parseInt(langId) || -1

    const state = useContext<MainState>(StoreContext)
    const client: IClient = state.app.client
    const lang = state.app.languages.find(x => x.id === langIdNum)
    if (!lang) return (html`<></>`)

    useEffect(() => {
        fetchFromClient(client.getLanguagesReq(), state.app.setLanguages)
        fetchFromClient(client.getAlternatives(tlIdNum), state.app.setAlternatives)
    }, [])

    const indPrimaryAlternative = state.app.alternatives.findIndex(x => x.isPrimary === true)
    const primaryAlternative = indPrimaryAlternative > -1 ? state.app.alternatives[indPrimaryAlternative] : null
    const nonPrimaryAlternatives = state.app.alternatives.filter((x, idx) => idx !== indPrimaryAlternative)
    
    return html`                         
        <div class="alternativeBody">
            <${AlternativePrimary} primaryAlternative=${primaryAlternative} lang=${lang} />
            ${nonPrimaryAlternatives.map((alt: AlternativeDTO, idx: number ) => {
                return html`<${Alternative} key=${idx} alternative=${alt} />`
            })}
            <div class="alternativeFooter"></div>
        </div>

        
    `
})

export default AlternativePg