import "./proposalInput.css"
import { html } from "htm/react"
import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import Login from "../../commonComponents/login/Login"
import { TaskDTO } from "../dto/AuxDTO"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { empty } from "../../utils/ComponentUtils"
import SelectChoice from "../../types/SelectChoice"


type Props = {
    lang: SelectChoice,
    taskOrId: {type: "task", payload: TaskDTO, } | {type: "taskId", payload: number, },
    closeCallback: () => void,
}

const ProposalInput: FunctionComponent<Props> = observer(({ lang, taskOrId, closeCallback, } : Props) => {
    const state = useContext<MainState>(StoreContext)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const [taskFromBackend, setTaskFromBackend] = useState<TaskDTO | null>(null)
    const acc = state.user.acc
    const signedIn = state.user.isUser()

    useEffect(() => {
        (async () => {
            if (taskOrId.type === "taskId") {
                const response = await state.client.taskGet(taskOrId.payload)
                if (response.isOK === true && response.value && response.value.length === 1) {
                    setTaskFromBackend(response.value[0])
                }
            }
        })()
    }, [taskOrId])

    const mbTask = taskOrId.type === "task" ? taskOrId.payload : taskFromBackend
    const saveProposalHandler = async () => {
        const headers = state.user.headersGet()
        if (headers === null || mbTask === null) return

        const task: TaskDTO = mbTask

        if (inputRef && inputRef.current && inputRef.current.value.length > 0) {
            const response = await state.app.client.proposalCreate(inputRef.current.value, lang.id, task.id, headers)

            if (response.status === "OK") {
                toast.success("Proposal saved", { autoClose: 2000 })
            } else {
                toast.error("Error: " + response.status, { autoClose: 7000 })
            }
            inputRef.current.value = ""
        }
        closeCallback()
    }

    const closeHandler = () => {
        if (inputRef !== null && inputRef.current !== null) inputRef.current.value = ""
        closeCallback()
    }
    if (mbTask === null) return empty

    return html`
        <div class="proposalInputContainer">
            ${((state.user.acc !== null && signedIn === true)
                ? html`
                    <div class="proposalInputBlock">Propose a <span class="proposalInputLang">${lang !== null && lang.name}</span> solution for <span class="proposalInputTask">${mbTask.name}</span>
                    </div>
                    <div class="proposalInputBlock">Task description: ${mbTask.description}</div>
                    <div class="proposalInputBlockText">
                        <textarea class="proposalInputTextArea" ref=${inputRef}></textarea>
                    </div>
                    <div class="proposalInputButtons">
                        <div class="proposalInputButton" onClick=${closeHandler}>Cancel</div>
                        <div class="proposalInputButton" onClick=${saveProposalHandler}>Save</div>
                    </div>
                `
                : html `
                    <${Login} closeCallback=${closeCallback} />
                `)
            }
        </div>
    `
})

export default ProposalInput
