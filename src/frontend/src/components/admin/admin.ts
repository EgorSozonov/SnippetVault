import React from 'react'
import { NavLink } from 'react-router-dom';
import EditableList from '../../commonComponents/editableList/editableList';
import PATHS from '../../path';
import Language from '../../types/language';
import TaskGroup from '../../types/taskGroup';
import Alternative from './alternative';
import NewProposal from './newProposal';
import { html } from 'htm/react'


const groups: TaskGroup[] = [
    {id: 1, name: "String manipulation"},
    {id: 2, name: "File system tasks"},
    {id: 3, name: "Common types & operations on them"},
]

const langs: Language[] = [
    {id: 1, name: "C#", languageGroup: "Universal", },
    {id: 2, name: "C++", languageGroup: "Universal", },
    {id: 3, name: "Typescript", languageGroup: "Universal", },
]

function Admin() {
    return (
        <div style={{overflow: "scroll", backgroundColor: "#303030"}}>
            <p>
                <NavLink to={PATHS["snippet"].url}><div className="adminHeader">Back to snippets</div></NavLink>
            </p>
            <EditableList<TaskGroup> values={groups} title="Task groups"></EditableList>
            <EditableList<Language> values={langs} title="Languages"></EditableList>
            <div>
                <Alternative />
            </div>
            <div>
                <NewProposal />
            </div>
            
            

        </div>
      );
}

export default Admin