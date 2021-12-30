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
    const { tlId } = useParams<{ tlId: string }>()
    const tlIdNum: number = parseInt(tlId) || -1

    const state = useContext<MainState>(StoreContext)
    const client: IClient = state.app.client

    useEffect(() => {
        fetchFromClient(client.getLanguagesReq(), state.app.setLanguages)
        fetchFromClient(client.getAlternatives(tlIdNum), state.app.setAlternatives)
    }, [])

    const indPrimaryAlternative = state.app.alternatives.findIndex(x => x.isPrimary === true)
    const primaryAlternative = indPrimaryAlternative > -1 ? state.app.alternatives[indPrimaryAlternative] : null
    const nonPrimaryAlternatives = state.app.alternatives.filter((x, idx) => idx !== indPrimaryAlternative)
    
    return html`                         
        <div class="alternativeBody">
            <${AlternativePrimary} primaryAlternative=${primaryAlternative} langId=${langIdNum} taskId=${taskIdNum} />    
            ${nonPrimaryAlternatives.map((alt: AlternativeDTO, idx: number ) => {
                return html`<${Alternative} key=${idx} alternative=${alt} />`
            })}
            <div class="alternativeFooter"></div>
        </div>

        
    `
})

export default AlternativePg