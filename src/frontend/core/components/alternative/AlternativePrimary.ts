import "./Alternative.css"
import { html } from "htm/react"
import { FunctionComponent, useContext } from "react"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import AlternativeDTO from "../../types/dto/AlternativeDTO"
import Toggler from "../../commonComponents/toggler/Toggler"
import { observer } from "mobx-react-lite"
import { fmtDt } from "../../utils/DateFormat"


type Props = {
    primaryAlternative: AlternativeDTO | null,
    langId: number,
    taskId: number,
}

const AlternativePrimary: FunctionComponent<Props> = observer(({
        primaryAlternative, langId, }: Props) => {
    const state = useContext<MainState>(StoreContext)    
    const language = state.app.languages.find(x => x.id === langId)
    console.log(primaryAlternative)
    return html`                 
        <div class="alternativeHeader">
            <div class="alternativeHeaderTitle">Alternatives</div>
            <div class="alternativeHeaderMain">
                <div class="alternativeHeaderMainLeft">
                    <div class="alternativeHeaderMainLeftCode">
                        ${primaryAlternative !== null && primaryAlternative.snippetCode}
                    </div>
                </div>
                <div class="alternativeHeaderMainMid">
                    <div>
                        Language: ${language && language.name}
                    </div>
                    <div>
                        Task: Walk a folder
                    </div>
                </div>
                <div class="alternativeHeaderMainRight">
                    <div>
                        <${Toggler} leftChoice=${"By date"} rightChoice=${"By votes"} initChosen=${false} />
                    </div>                    
                </div>                
            </div>
            <div class="alternativeHeaderMainFooter">
                <span>Upload date: ${primaryAlternative !== null && fmtDt(primaryAlternative.tsUpload)}</span>
                <span>Score: ${primaryAlternative !== null && primaryAlternative.score}</span>
            </div>         
        </div>        
    `
})

export default AlternativePrimary