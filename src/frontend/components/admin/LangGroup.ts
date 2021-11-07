import React from 'react'
import { NavLink } from 'react-router-dom'
import PATHS from '../../params/Path'
import { html } from 'htm/react'
import EditableList from '../../commonComponents/editableList/EditableList'
import LanguageGroupDTO from '../../../common/dto/LanguageGroupDTO'
import { Editability } from '../../types/Editability'
import TaskDTO from '../../../common/dto/TaskDTO'

const ListTasks = (props: any) => EditableList<TaskDTO>(props)
const editabilityName: Editability[] = [
    {
        field: "name",
        fieldType: "string",
    }
]
function LangGroup() {
    return html`
        <div>Hello world group
            <p>
                <${NavLink} to=${PATHS["admin"].url}>
                    <div class="adminHeader">Back to admin</div>
                <//>
            </p>
        </div>
        <div>
            <${ListTasks} values=${state.app.taskGroups} editabilities=${editabilityName} title="Task groups"></EditableList>
        </div>
    `
}

export default LangGroup