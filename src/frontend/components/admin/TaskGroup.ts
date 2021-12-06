import React from 'react'
import { NavLink } from 'react-router-dom'
import PATHS from '../../params/Path'
import { html } from 'htm/react'
import EditableList from '../../commonComponents/editableList/EditableList'
import TaskGroupDTO from '../../../common/dto/TaskGroupDTO'
import { Editability } from '../../types/Editability'

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