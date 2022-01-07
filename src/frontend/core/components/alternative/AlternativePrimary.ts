import "./Alternative.css"
import { html } from "htm/react"
import { FunctionComponent } from "react"
import Toggler from "../../commonComponents/toggler/Toggler"
import { observer } from "mobx-react-lite"
import { fmtDt } from "../../utils/DateFormat"
import { AlternativeDTO } from "../../types/dto/SnippetDTO"
import { LanguageDTO, TaskDTO } from "../../types/dto/AuxDTO"
import TaskGroup from "../admin/TaskGroup"


type Props = {
    primaryAlternative: AlternativeDTO | null,    
    lang: LanguageDTO | null,
    task: TaskDTO | null,
}

const AlternativePrimary: FunctionComponent<Props> = observer(({
        primaryAlternative, lang, }: Props) => {
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
                        Task: ${task !== null && TaskGroup}
                    </div>
                </div>
                <div class="alternativeHeaderMainRight">
                    <div>
                        <${Toggler} leftChoice=${"By date"} rightChoice=${"By votes"} initChosen=${false} />
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