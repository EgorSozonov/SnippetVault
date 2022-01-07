import "./Alternative.css"
import { html } from "htm/react"
import { FunctionComponent, useContext } from "react"
import Toggler from "../../commonComponents/toggler/Toggler"
import { observer } from "mobx-react-lite"
import { fmtDt } from "../../utils/DateFormat"
import { AlternativeDTO } from "../../types/dto/SnippetDTO"
import { LanguageDTO, TaskDTO } from "../../types/dto/AuxDTO"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"


type Props = {
    primaryAlternative: AlternativeDTO | null,    
    lang: LanguageDTO | null,
    task: TaskDTO,
    tlId: number,
}

const AlternativePrimary: FunctionComponent<Props> = observer(({
        primaryAlternative, lang, task, tlId, }: Props) => {
    const state = useContext<MainState>(StoreContext)            
    return html`                 
        <div class="alternativeHeader">
            <div class="alternativeHeaderTitle">Alternatives</div>
            <div class="alternativeHeaderMain">
                <div class="alternativeHeaderMainLeft">
                    <div class="alternativeHeaderMainLeftCode">
                        ${primaryAlternative !== null && primaryAlternative.code}
                    </div>
                </div>
                <div class="alternativeHeaderMainMid">
                    <div> Language: 
                        ${lang !== null && lang.name}
                    </div>
                    <div>
                        Task: ${task.taskGroupName} / ${task.name}
                    </div>
                    <div>
                        Description: ${task.description}
                    </div>
                </div>
                <div class="alternativeHeaderMainRight">
                    <div>
                        <${Toggler} leftChoice=${"By date"} rightChoice=${"By votes"} initChosen=${false} 
                                    leftCallback=${() => state.app.alternativesResort("byDate")} rightCallback=${() => state.app.alternativesResort("byScore")} />
                    </div>                    
                </div>                
            </div>
            <div class="alternativeHeaderMainFooter">
                <span>Upload date: ${primaryAlternative !== null && html`tsUpload`}</span>
                <span>Score: ${primaryAlternative !== null && primaryAlternative.score}</span>
            </div>         
        </div>        
    `
})

export default AlternativePrimary