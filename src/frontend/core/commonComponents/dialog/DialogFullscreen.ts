import React, { ReactNode } from "react"
import { html } from "htm/react"
import "./dialog.css"
import DialogState from "./DialogState"


type Props = {
    state: DialogState,
    okHandler: any,
    cancelHandler: any,
    children: ReactNode,
}

const DialogFullscreen: React.FunctionComponent<Props> = ({state, okHandler, cancelHandler, children, }: Props) => {
    return html`
        <div class=${"dialogFullscreenContainer" + (state.isOpen === true ? " dialogActive" : " dialogInactive")}>
            <div class="dialogBody">
                ${state.title}
            </div>
            <div>
                ${children}
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
    `
}

export default DialogFullscreen