import React, { ReactNode, useEffect } from "react"
import { html } from "htm/react"
import "./dialog.css"
import DialogState from "./DialogState"


type Props = {
    state: DialogState,
    okHandler: () => void,
    cancelHandler: () => void,
    children: ReactNode,
}

const DialogFullscreen: React.FunctionComponent<Props> = ({state, okHandler, cancelHandler, children, }: Props) => {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                cancelHandler()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        
        return function cleanup() {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [])
    return html`        
        <div class=${"dialogContainerFullscreen" + (state.isOpen === true ? " dialogActive" : " dialogInactive")} onKeyDown>
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