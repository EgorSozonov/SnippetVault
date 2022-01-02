import "./snippet.css"
import { html } from 'htm/react'
import { FunctionComponent, useContext, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import Login from "../../commonComponents/login/Login"


type Props = {
    langId: number,
    taskId: number,
    numberProposals: number,
}

const TextInput: FunctionComponent<Props> = observer(({numberProposals, langId, taskId, } : Props) => {
    const state = useContext<MainState>(StoreContext)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const userStatus = state.user.userStatus
    let [showInput, setShowInput] = useState(false)

    const signedIn = (userStatus === "user" || userStatus === "admin") 
    const saveProposalHandler = () => {
        if (inputRef && inputRef.current) {
            console.log("posting:")
            console.log(inputRef.current.value)
            if (inputRef.current.value.length > 0) {
                state.app.client.proposalCreate(inputRef.current.value, langId, taskId)
                inputRef.current.value = ""
            }
        }
    }
    return html`
        <div class="snippetTextInput">
            ${showInput === true &&
            (signedIn 
                ? html`
                    <p>Propose a snippet ${numberProposals > 0 ? html`${numberProposals} proposals already awaiting premoderation` : ""}:</p>
                    <p><textarea class="snippetTextArea" ref=${inputRef}></textarea></p>
                    <p><button class="snippetButton" onClick=${saveProposalHandler}>Save</button></p>
                    <div class="snippetPlusButton" onClick=${() => setShowInput(false)}>-</div>
                `
                : html `
                    <${Login} />
                    <div class="snippetPlusButton" onClick=${() => setShowInput(false)}>-</div>
                ` )
            }

            ${showInput === false &&
                html`<div class="snippetPlusButton" onClick=${() => setShowInput(true)}><span>+</span></div>`
            }            
        </div>
    ` 
      
})

export default TextInput