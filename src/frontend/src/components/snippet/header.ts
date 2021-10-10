import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import HoverSelect from '../../commonComponents/hoverSelect/hoverSelect'
import './snippet.css'
import { html } from 'htm/react'


const Header: React.FunctionComponent = () => {
    const dispatch = useDispatch()
    const callback1 = (c: string) => {
        dispatch({type: "setLanguage1", payload: {newValue: c}})
    }

    const callback2 = (c: string) => {
        dispatch({type: "setLanguage2", payload: {newValue: c}})
    }

    const callbackTaskGroup = (c: string) => {
        dispatch({type: "setTaskGroup", payload: {newValue: c}})
    }

    return (html `
        <nav>
            <div class="headerContainer">
                <div class="choiceInput headerLeftmost">
                    <div class="headerDropdownLabel"><label >Task group:</label></div>
                    <${HoverSelect} choices=${["strings", "file system", "spreadsheets"]} uniqueName="TaskGroupChoice"
                        selectCallback=${callbackTaskGroup}><//>
                </div>
                <div class="choiceInput">
                    <div class="headerDropdownLabel"><label >Language 1:</label></div>
                    <${HoverSelect} choices=${["C#", "Swift", "Typescript"]} uniqueName="Lang1"
                        selectCallback=${callback1}><//>
                </div>
                <div class="choiceInput">
                    <div class="headerDropdownLabel"><label >Language 2:</label></div>
                    <${HoverSelect} choices=${["C#", "Typescript"]} uniqueName="Lang2" 
                        selectCallback=${callback2}><//>
                    
                </div>
                <div class="choiceInputButton">
                    ↩ Previous
                </div>
                <div class="choiceInputButton headerRightmost">
                    ↪ Next
                </div>
            </div>
        </nav>
        `
      );
}

export default Header