import "./proposalInput.css"
import { html } from "htm/react"
import { FunctionComponent, useContext, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import Login from "../../commonComponents/login/Login"
import { LanguageDTO, TaskDTO } from "../dto/AuxDTO"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
    const saveProposalHandler = async () => {
        const headers = state.user.headersGet()
        if (headers === null) return

        if (inputRef && inputRef.current && inputRef.current.value.length > 0) {            
            const response = await state.app.client.proposalCreate(inputRef.current.value, lang.id, task.id, headers)
            
            if (response.status === "OK") {
                toast.success("Proposal saved", { autoClose: 2000 })
            } else {
                toast.error("Error: " + response.status, { autoClose: 7000 })
            }
            inputRef.current.value = ""            
        }
        closeCallback()
    }

    const closeHandler = () => {
        if (inputRef !== null && inputRef.current !== null) inputRef.current.value = ""
        closeCallback()
    }

    return html`
        <div class="proposalInputContainer">
            ${((acc !== null && signedIn === true)
                ? html`
                    <div class="proposalInputBlock">Propose a <span class="proposalInputLang">${lang !== null && lang.name}</span> solution for <span class="proposalInputTask">${task.name}</span>
                    </div>
                    <div class="proposalInputBlock">Task description: ${task.description}</div>
                    <div class="proposalInputBlock">
                        <textarea class="proposalInputTextArea" ref=${inputRef}></textarea>                        
                    </div>
                    <div class="proposalInputButtons">
                        <div class="proposalInputButton" onClick=${saveProposalHandler}>Save</div>
                        <div class="proposalInputButton" onClick=${closeHandler}>Cancel</div>
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