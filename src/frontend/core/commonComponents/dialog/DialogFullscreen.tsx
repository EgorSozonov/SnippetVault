import React, { ReactNode, useEffect } from "react"
import "./dialog.css"
import DialogState from "./DialogState"


type Props = {
    state: DialogState,
    closeCallback: () => void,
    children: ReactNode,
}

const DialogFullscreen: React.FunctionComponent<Props> = ({state, closeCallback, children, }: Props) => {
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
    return (
        <div className={"dialogContainerFullscreen" + (state.isOpen === true ? " dialogActive" : " dialogInactive")} onKeyDown>
            <div className="dialogTitle">
                <h3>${state.title}</h3>
            </div>
            <div className="dialogFullscreenChildren">
                ${children}
            </div>
        </div>
    )
}

export default DialogFullscreen
