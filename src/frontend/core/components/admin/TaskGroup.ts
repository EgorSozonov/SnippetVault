import { NavLink } from "react-router-dom"
import PATHS from "../../params/Path"
import { html } from "htm/react"
import { Editability } from "../../types/Editability"
import { TaskGroupDTO } from "../../types/dto/AuxDTO"


const editabilityName: Editability<TaskGroupDTO>[] = [
    {
        field: "name",
        fieldType: "string",
    }
]

function TaskGroup() {
    return html`
        <div>Hello world group
            <p>
                <${NavLink} to=${PATHS["admin"].url}>
                    <div class="adminHeader">Back to admin</div>
                <//>
            </p>
        </div>
    `
}

export default TaskGroup