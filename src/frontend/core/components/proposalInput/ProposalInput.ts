import "./proposalInput.css"
import { html } from "htm/react"
import { FunctionComponent, useContext, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import Login from "../../commonComponents/login/Login"
import { LanguageDTO, TaskDTO } from "../dto/AuxDTO"


type Props = {
    lang: LanguageDTO,
    task: TaskDTO,
    closeCallback: () => void,
}

const ProposalInput: FunctionComponent<Props> = observer(({ lang, task, closeCallback, } : Props) => {
    const state = useContext<MainState>(StoreContext)
    const inputRef = useRef<HTMLTextAreaElement>(null)


    const acc = state.user.acc
    const signedIn = state.user.isUser()
    const saveProposalHandler = () => {
        const headers = state.user.headersGet()
        
        if (inputRef && inputRef.current && inputRef.current.value.length > 0 && headers !== null) {
            state.app.client.proposalCreate(inputRef.current.value, lang.id, task.id, headers)
            inputRef.current.value = ""            
        }
    }

    return html`
        <div class="proposalInputContainer">
            ${(signedIn === true
                ? html`
                    <div class="proposalInputBlock">Propose a <span class="proposalInputLang">${lang !== null && lang.name}</span> solution for <span class="proposalInputTask">${task.name}</span>
                    </div>
                    <div class="proposalInputBlock">Task description: ${task.description}</div>
                    <div>
                        <textarea class="proposalInputTextArea" ref=${inputRef}></textarea>
                        
                        
                    </div>
                    <div class="proposalInputButtons">
                        <div class="proposalInputButton" onClick=${saveProposalHandler}>Save</div>
                        <div class="proposalInputButton" onClick=${closeCallback}>Cancel</div>
                    </div>
                `
                : html `
                    <${Login} />
                    <div class="proposalInputButton" onClick=${closeCallback}>Cancel</div>
                ` )
            }
     
        </div>
    ` 
      
})

export default ProposalInput