import React from 'react'
import { NavLink } from 'react-router-dom';
import EditableList from '../../commonComponents/editableList/EditableList';
import PATHS from '../../params/Path';
import LanguageDTO from '../../../common/dto/LanguageDTO';
import TaskGroupDTO from '../../../common/dto/TaskGroupDTO';
import Alternative from '../alternative/Alternative';
import NewProposal from './NewProposal';
import { html } from 'htm/react'
import { mockData } from '../../dataSource/mock/MockData';


const ListTaskGroups = (props: any) => EditableList<TaskGroupDTO>(props)
const ListLanguages = (props: any) => EditableList<LanguageDTO>(props)

function Admin() {
    return html`
        <div class="adminContainer">
            <p>
                <${NavLink} to=${PATHS["snippet"].url}>
                    <div class="adminHeader">Back to snippets</div>
                <//>
            </p>
            <${ListTaskGroups} values=${mockData.taskGroups} title="Task groups"></EditableList>
            <${ListLanguages} values=${mockData.languages} title="Languages"></EditableList>
            <div>
                <${Alternative} />
            </div>
            <div>
                <${NewProposal} />
            </div>
        </div>
    `
}

export default Admin