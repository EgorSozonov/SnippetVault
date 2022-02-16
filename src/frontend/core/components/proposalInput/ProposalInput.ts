import "./proposalInput.css"
import { html } from "htm/react"
import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import MainState from "../../mobX/AllState"
import { StoreContext } from "../../App"
import Login from "../../commonComponents/login/Login"
import { TaskDTO } from "../../types/dto/AuxDTO"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { empty } from "../../utils/ComponentUtils"
import SelectChoice from "../../types/SelectChoice"
import { ProposalCreateDTO } from "../../types/dto/SnippetDTO"


type Props = {
    lang: SelectChoice,
    taskOrId: {type: "task", payload: TaskDTO, } | {type: "taskId", payload: number, },
    closeCallback: () => void,
}

const ProposalInput: FunctionComponent<Props> = observer(({ lang, taskOrId, closeCallback, } : Props) => {
    const state = useContext<MainState>(StoreContext)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const inputLibRef = useRef<HTMLTextAreaElement>(null)
    const [taskFromBackend, setTaskFromBackend] = useState<TaskDTO | null>(null)
    const acc = state.user.acc
    const signedIn = state.user.isUser()

    const [isLibOpen, setIsLibOpen] = useState(false)

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
            const libraries = inputLibRef.current && inputLibRef.current.value ? inputLibRef.current.value : undefined
            const createDTO: ProposalCreateDTO = { content: inputRef.current.value, langId: lang.id, taskId: task.id, libraries, }
            const response = await state.snip.proposalCreate(createDTO, headers)
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
        setIsLibOpen(false)
        closeCallback()
    }
    if (mbTask === null) return empty

    return html`
        <div class="proposalInputContainer">
            ${((acc !== null && signedIn === true)
                ? html`
                    <div class="proposalInputBlock">Propose a <span class="proposalInputLang">${lang !== null && lang.name}</span> solution for <span class="proposalInputTask">${mbTask.name}</span>
                    </div>
                    <div class="proposalInputBlock">Task description: ${mbTask.description}</div>
                    <div class="proposalInputBlockText">
                        <textarea class="proposalInputTextArea" ref=${inputRef}></textarea>
                    </div>
                    ${isLibOpen === true
                        ? html`
                            <div class="proposalInputBlockLib">
                                <p>Specify necessary libraries for this snippet:
                                    <span onClick=${() => setIsLibOpen(false)} class="proposalInputLibTurnOff" title="Cancel specifying libraries">
                                        x
                                    </span>
                                </p>
                                <textarea class="proposalInputTextArea" ref=${inputLibRef}></textarea>

                            </div>
                        `
                        : html`
                            <div onClick=${() => setIsLibOpen(true)} class="proposalInputLibTurnOn">
                                Optional: specify necessary libraries
                            </div>
                        `
                    }

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
