import React, { ReactNode } from "react"
import "./dialog.css"
import DialogState from "./DialogState"


type Props = {
    state: DialogState,
    okHandler: () => void,
    cancelHandler: () => void,
    children: ReactNode,
}

const DialogConfirm: React.FunctionComponent<Props> = ({state, okHandler, cancelHandler, children, }: Props) => {
    return (
        <div className={"dialogOverlay" + (state.isOpen === true ? " dialogActive" : " dialogInactive")}>
            <div className="dialogContainer">
                <div className="dialogBody">
                    {state.title}
                </div>
                <div>
                    {children}
                </div>
                <div className="dialogButtons">
                    <div className="dialogButton" onClick={cancelHandler}>
                        Cancel
                    </div>
                    <div className="dialogButton" onClick={okHandler}>
                        OK
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DialogConfirm
