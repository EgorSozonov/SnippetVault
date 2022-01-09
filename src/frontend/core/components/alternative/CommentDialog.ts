import "./Alternative.css"
import { html } from "htm/react"
import { FunctionComponent, useContext, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { fmtDt } from "../../utils/DateUtils";
import { CommentDTO } from "../../types/dto/UserDTO";
import DialogState from "../../commonComponents/dialog/DialogState";
import MainState from "../../mobX/MainState";
import { StoreContext } from "../../App";
import DialogFullscreen from "../../commonComponents/dialog/DialogFullscreen";
import { fetchFromClient } from "../../utils/Client";
import Login from "../../commonComponents/login/Login";


type Props = {  
    dialogState: DialogState,
    cancelHandler: () => void,
    okHandler: (i: string) => void,
}

const CommentDialog: FunctionComponent<Props> = observer(({ dialogState, cancelHandler, okHandler, }: Props) => {       
    const state = useContext<MainState>(StoreContext)

    useEffect(() => {
        if (dialogState.isOpen === false) return

        console.log("fetching for id " + dialogState.id)
        fetchFromClient(state.app.client.commentsGet(dialogState.id), state.app.commentsSet)
    }, [dialogState])


    return html`
        <${DialogFullscreen} cancelHandler=${cancelHandler} okHandler=${okHandler} state=${dialogState}>              
            <ol>
                ${state.app.comments.map((comm: CommentDTO, idx: number) => {
                    return html`<li key=${idx} class="alternativeItemCommentsComment">
                        <div>
                            <span class="alternativeItemCommentsAuthor">
                                [${fmtDt(comm.tsUpload)}] ${comm.author} 
                            </span>
                        </div>
                        <div class="alternativeItemCommentsText">${comm.content}</div>
                    </li>
                    `
                })}
            </ol>
            ${state.user.isUser() === true && 
                html`
                <div>
                    <textarea />
                </div>`
            }
            ${state.user.isUser() === false && 
                html`<${Login} />`
            }
        <//>
    `
})

export default CommentDialog