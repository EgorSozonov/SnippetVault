import React, { ReactNode, useEffect } from "react"
import { html } from "htm/react"
import "./dialog.css"
import DialogState from "./DialogState"


type Props = {
    state: DialogState,
    closeCallback: () => void,
    children: ReactNode,
}

const DialogFullscreen: React.FunctionComponent<Props> = ({state, closeCallback, children, }: Props) => {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                closeCallback()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        
        return function cleanup() {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [])
    return html`        
        <div class=${"dialogContainerFullscreen" + (state.isOpen === true ? " dialogActive" : " dialogInactive")} onKeyDown>
            <div class="dialogTitle">
                <h3>${state.title}</h3>
            </div>
            <div class="dialogFullscreenChildren">
                ${children}
            </div>

        </div>
        
    `
}

export default DialogFullscreen