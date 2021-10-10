import React from 'react'
import "./snippet.css"
import { html } from 'htm/react'


type Props = {
    numberProposals: number,
}
function TextInput({numberProposals, } : Props) {
    return html`
        <div>
            <p>Propose a snippet ${numberProposals > 0 ? html`${numberProposals} proposals already awaiting premoderation` : ""}:</p>
            <p><textarea class="snippetTextArea"></textarea></p>
            <p><button class="snippetButton">Save</button></p>
        </div>
    ` 
      
}

export default TextInput