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


const Alternative: FunctionComponent = observer(({}: any) => {
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
    
    return html`
                 
        <div class="alternativeBody">
            <div class="alternativeHeader">
                <div class="alternativeLeftHeader">
                    Alternatives
                </div>
                <div class="taskForHeader"><${Toggler} leftChoice=${"By date"} rightChoice=${"By votes"} initChosen=${false} />
                            
                </div>
                <div class="alternativeRightHeader">
                    <div>
                        Task: foo
                    </div>
                    <div>
                        Language: ${language ? language.name : ""}
                    </div>
                </div>
            </div>
            <div>asdf</div>
            ${state.app.alternatives.map((alt: AlternativeDTO, idx: number ) => {
                console.log("inside `map`")
                console.log(alt.tsUpload)
                console.log(fmtDt(alt.tsUpload))
                const evenClass = (idx%2 === 0 ? " evenRow" : "")
                return html`
                    <div class="alternativeRow" key=${idx}>
                        <div class=${"alternative alternativeLeftSide" + evenClass}>${alt.primaryCode}</div>
                        <div class=${"alternativeTimestampContainer" + evenClass}>
                            <div class="alternativeTimestamp">${fmtDt(alt.tsUpload)}</div>
                            
                        </div>
                        <div class=${"alternative alternativeRightSide" + evenClass}>
                            <div class="taskRight commentButton" title="Promote to main version">
                                P
                            </div>                                
                            ${alt.alternativeCode}
                        </div>
                    </div>
                    `
            })}
            
        </div>

        
    `
})

export default Alternative