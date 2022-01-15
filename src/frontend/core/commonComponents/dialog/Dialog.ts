import React, { ReactNode, useEffect } from "react"
import { html } from "htm/react"
import "./dialog.css"
import DialogState from "./DialogState"


type Props = {
    state: DialogState,
    closeCallback: () => void,
    children: ReactNode,
}

const Dialog: React.FunctionComponent<Props> = ({state, closeCallback, children, }: Props) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeCallback()
            } else {
                return
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        
        return function cleanup() {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [])
    
    return html`
        <div class=${"dialogOverlay" + (state.isOpen === true ? " dialogActive" : " dialogInactive")}>
            <div class="dialogContainer">
                <div class="dialogHeader">
                    <span>
                        <h4>${state.title}</h4>
                    </span>
                    <span class="dialogHeaderRight" onClick=${closeCallback}>[X]
                    </span>
                </div>
                <div>
                    ${children}
                </div>
            </div>
        </div>
    `
}

export default Dialog