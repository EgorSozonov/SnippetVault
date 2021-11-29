import "./snippet.css"
import { html } from 'htm/react'
import { FunctionComponent, useContext, useRef } from "react"
import { observer } from "mobx-react-lite"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import Login from "../../commonComponents/login/Login"


type Props = {
    numberProposals: number,
}

const TextInput: FunctionComponent<Props> = observer(({numberProposals, } : Props) => {
    const state = useContext<MainState>(StoreContext)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const userStatus = state.user.userStatus
    let showInput = false
    if (userStatus === "user" || userStatus === "admin") {
        showInput = true
    }
    const saveProposalHandler = () => {
        // TODO state.app.client.
    }
    return html`
        <div>
            ${showInput === true 
            ? html`
                <p>Propose a snippet ${numberProposals > 0 ? html`${numberProposals} proposals already awaiting premoderation` : ""}:</p>
                <p><textarea class="snippetTextArea"></textarea></p>
                <p><button class="snippetButton" onClick=${saveProposalHandler}>Save</button></p>
            `
            : html `
                <${Login} />
            ` }
            
        </div>
    ` 
      
})

export default TextInput