import "./Alternative.css"
import { html } from "htm/react"
import { useParams } from "react-router";
import { FunctionComponent, useContext, useEffect } from "react"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import IClient from "../../interfaces/IClient"
import { fetchFromClient } from "../../utils/Client"
import AlternativeDTO from "../../../common/dto/AlternativeDTO"
import Toggler from "../../commonComponents/toggler/Toggler"
import { observer } from "mobx-react-lite"
import { fmtDt } from "../../utils/DateFormat"
import Alternative from "./Alternative";
import { stat } from "fs";


const AlternativePg: FunctionComponent = observer(({}: any) => {
    const { taskId, langId } = useParams<{taskId: string, langId: string}>()
    const taskIdNum: number = parseInt(taskId) || -1
    const langIdNum: number = parseInt(langId) || -1
    const state = useContext<MainState>(StoreContext)
    const client: IClient = state.app.client
    const language = state.app.languages.find(x => x.id === langIdNum)
    console.log("languages")
    console.log(state.app.languages)
    useEffect(() => {
        fetchFromClient(client.getLanguagesReq(), state.app.setLanguages)
        fetchFromClient(client.getAlternatives(langIdNum, taskIdNum), state.app.setAlternatives)
    }, [])
    const indPrimaryAlternative = state.app.alternatives.findIndex(x => x.isPrimary === true)

    
    return html`
                 
        <div class="alternativeBody">
            <div class="alternativeHeader">
                <div class="alternativeHeaderTitle">Alternatives</div>
                <div class="alternativeHeaderMain">
                    <div class="alternativeHeaderMainLeft">
                        ${indPrimaryAlternative > -1 ? state.app.alternatives[indPrimaryAlternative].snippetCode : ""}
                    </div>
                    <div class="alternativeHeaderMainRight">
                        <div>
                            <${Toggler} leftChoice=${"By date"} rightChoice=${"By votes"} initChosen=${false} />
                        </div>
                        <div>
                            Task: foo
                        </div>
                        <div>
                            Language: ${language ? language.name : ""}
                        </div>
                    </div>                
                </div>
                
            </div>
            ${state.app.alternatives.map((alt: AlternativeDTO, idx: number ) => {
                return html`<${Alternative} alternative=${alt} />`
            })}
            
        </div>

        
    `
})

export default AlternativePg