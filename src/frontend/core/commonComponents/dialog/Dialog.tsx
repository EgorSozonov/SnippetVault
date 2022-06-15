import React, { ReactNode, useEffect } from "react"
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

    return (
        <div className={"dialogOverlay" + (state.isOpen === true ? " dialogActive" : " dialogInactive")}>
            <div className="dialogContainer">
                <div className="dialogHeader">
                    <span>
                        <h4>{state.title}</h4>
                    </span>
                    <span className="dialogHeaderRight" onClick={closeCallback}>[X]
                    </span>
                </div>

                {children}

            </div>
        </div>
    )
}

export default Dialog
