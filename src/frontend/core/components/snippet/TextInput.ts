import "./snippet.css"
import { html } from "htm/react"
import { FunctionComponent, useContext, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import MainState from "../../mobX/AllState"
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

    let [showInput, setShowInput] = useState(false)

    const acc = state.user.acc
    const signedIn = state.user.isUser()
    const saveProposalHandler = () => {
        const headers = state.user.headersGet()

        if (inputRef && inputRef.current && inputRef.current.value.length > 0 && headers !== null) {
            state.snip.client.proposalCreate(inputRef.current.value, langId, taskId, headers)
            inputRef.current.value = ""
        }
    }

    return html`
        <div class="snippetTextInput">
            ${showInput === true &&
            (signedIn
                ? html`
                    <p>Propose a snippet:</p>
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
