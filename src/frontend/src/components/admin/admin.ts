import React from 'react'
import { NavLink } from 'react-router-dom';
import EditableList from '../../commonComponents/editableList/editableList';
import PATHS from '../../path';
import LanguageDTO from '../../types/LanguageDTO';
import TaskGroupDTO from '../../types/TaskGroupDTO';
import Alternative from './alternative';
import NewProposal from './newProposal';
import { html } from 'htm/react'


const groups: TaskGroupDTO[] = [
    {id: 1, name: "String manipulation"},
    {id: 2, name: "File system tasks"},
    {id: 3, name: "Common types & operations on them"},
]

const langs: LanguageDTO[] = [
    {id: 1, name: "C#", languageGroup: "Universal", },
    {id: 2, name: "C++", languageGroup: "Universal", },
    {id: 3, name: "Typescript", languageGroup: "Universal", },
]
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
            <${ListTaskGroups} values=${groups} title="Task groups"></EditableList>
            <${ListLanguages} values=${langs} title="Languages"></EditableList>
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