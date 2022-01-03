import React from "react"
import { html } from "htm/react"
import "./dialog.css"
import DialogState from "./DialogState"


type Props = {
    state: DialogState,
    okHandler: any,
    cancelHandler: any,
}

const Dialog: React.FunctionComponent<Props> = ({state, okHandler, cancelHandler, }: Props) => {
    console.log("dialog " + state.isOpen)
    return html`
        <div class=${"dialogOverlay" + (state.isOpen === true ? " dialogActive" : " dialogInactive")}>
            <div class="dialogContainer">
                <div class="dialogBody">
                    ${state.title}
                </div>
                <div class="dialogButtons">
                    <div class="dialogButton" onClick=${cancelHandler}>
                        Cancel
                    </div>
                    <div class="dialogButton" onClick=${okHandler}>
                        OK
                    </div>
                </div>
            </div>
        </div>
    `
}

export default Dialog