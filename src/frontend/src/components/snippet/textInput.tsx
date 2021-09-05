import React from 'react'
import "./snippet.css"

type Props = {
    numberProposals: number,
}
function TextInput({numberProposals, } : Props) {
    return (
        <div><p>Propose a snippet{numberProposals > 0 ? ` (${numberProposals} proposals already awaiting premoderation)` : ""}:</p>
        <p><textarea className="snippetTextArea"></textarea></p>
        <p><button className="snippetButton">Save</button></p></div>
      );
}

export default TextInput