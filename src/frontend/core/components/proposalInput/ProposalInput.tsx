import React from "react"
import "./proposalInput.css"
import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import MainState from "../../mobX/AllState"
import { storeContext } from "../../App"
import Login from "../../commonComponents/login/Login"
import { TaskDTO } from "../../types/dto/AuxDTO"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { empty } from "../../utils/ComponentUtils"
import SelectChoice from "../../types/SelectChoice"
import { ProposalCreateDTO } from "../../types/dto/SnippetDTO"


export type Props = {
    lang: SelectChoice,
    taskOrId: {type: "task", payload: TaskDTO, } | {type: "taskId", payload: number, },
    closeCallback: () => void,
}

const ProposalInput: FunctionComponent<Props> = observer(({ lang, taskOrId, closeCallback, } : Props) => {
    const state = useContext<MainState>(storeContext)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const inputLibRef = useRef<HTMLTextAreaElement>(null)
    const [taskFromBackend, setTaskFromBackend] = useState<TaskDTO | null>(null)
    const acc = state.user.acc
    const signedIn = state.user.isUser.get()

    const [isLibOpen, setIsLibOpen] = useState(false)
    const needData = acc !== null && signedIn === true

    useEffect(() => {
        if (needData === false) return
        (async () => {
            if (taskOrId.type === "taskId") {
                const response = await state.snip.taskGet(taskOrId.payload)
                if (response.isOK === true && response.value && response.value.length === 1) {
                    setTaskFromBackend(response.value[0])
                }
            }
        })()
    }, [taskOrId, needData])

    const mbTask = taskOrId.type === "task" ? taskOrId.payload : taskFromBackend
    const saveProposalHandler = async () => {
        const mbUserId = state.user.userNameGet()
        if (mbUserId === null || mbTask === null) return

        const task: TaskDTO = mbTask

        if (inputRef && inputRef.current && inputRef.current.value.length > 0) {
            const libraries = inputLibRef.current && inputLibRef.current.value ? inputLibRef.current.value : undefined
            const createDTO: ProposalCreateDTO = { content: inputRef.current.value, langId: lang.id, taskId: task.id, libraries, }
            const response = await state.snip.proposalCreate(createDTO, mbUserId)
            if (response.status === "OK") {
                toast.success("Proposal saved", { autoClose: 2000 })
            } else {
                toast.error("Error: " + response.status, { autoClose: 7000 })
            }

            inputRef.current.value = ""
            if (inputLibRef && inputLibRef.current) {
                inputLibRef.current.value = ""
            }
        }
        closeCallback()
    }

    const closeHandler = () => {
        if (inputRef !== null && inputRef.current !== null) inputRef.current.value = ""
        setIsLibOpen(false)
        closeCallback()
    }
    if (needData === true && mbTask === null) return empty
    return (
        <div className="proposalInputContainer">
            {((mbTask !== null)
                ?   <>
                        <div className="proposalInputBlock">Propose a <span className="proposalInputLang">{lang !== null && lang.name}</span> solution for <span className="proposalInputTask">{mbTask.name}</span>
                        </div>
                        <div className="proposalInputBlock">Task description: {mbTask.description}</div>
                        <div className="proposalInputBlockText">
                            <textarea className="proposalInputTextArea" ref={inputRef}></textarea>
                        </div>
                        {isLibOpen === true
                            ?
                                <div className="proposalInputBlockLib">
                                    <p>Specify necessary libraries for this snippet:
                                        <span onClick={() => setIsLibOpen(false)} className="proposalInputLibTurnOff" title="Cancel specifying libraries">
                                            x
                                        </span>
                                    </p>
                                    <textarea className="proposalInputTextArea" ref={inputLibRef}></textarea>

                                </div>

                            :
                                <div onClick={() => setIsLibOpen(true)} className="proposalInputLibTurnOn">
                                    Optional: specify necessary libraries
                                </div>

                        }

                        <div className="proposalInputButtons">
                            <div className="proposalInputButton" onClick={closeHandler}>Cancel</div>
                            <div className="proposalInputButton" onClick={saveProposalHandler}>Save</div>
                        </div>
                    </>
                : <Login closeCallback={closeCallback} />

            )}
        </div>
    )
})

export default ProposalInput
