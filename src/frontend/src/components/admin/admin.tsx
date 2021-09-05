import React from 'react'
import { NavLink } from 'react-router-dom';
import EditableList from '../../commonComponents/editableList/editableList';
import PATHS from '../../path';
import Language from '../../types/language';
import TaskGroup from '../../types/taskGroup';
import Alternative from './alternative';
import NewProposal from './newProposal';


const groups: TaskGroup[] = [
    {id: 1, code: "string", name: "String manipulation"},
    {id: 2, code: "fs", name: "File system tasks"},
    {id: 3, code: "commTypes", name: "Common types & operations on them"},
]

const langs: Language[] = [
    {id: 1, code: "Cs", name: "C#"},
    {id: 2, code: "Cpp", name: "C++"},
    {id: 3, code: "Typescript", name: "Typescript"},
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