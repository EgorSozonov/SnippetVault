import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import HoverSelect from '../../commonComponents/hoverSelect/hoverSelect'
import PATHS from '../../path';
import { SVState } from '../../redux/state';
import './snippet.css'

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
    return (
        <nav>
            <div className="headerContainer">
                <div className="choiceInput headerLeftmost">
                    <div style={{height: "2rem", margin: "0", padding: "0"}}><label >Task group:</label></div>
                    <HoverSelect choices={["strings", "file system", "spreadsheets"]} uniqueName="TaskGroupChoice"
                        selectCallback={callbackTaskGroup}></HoverSelect>
                </div>
                <div className="choiceInput">
                    <div style={{height: "2rem", margin: "0", padding: "0"}}><label >Language 1:</label></div>
                    <HoverSelect choices={["C#", "Swift", "Typescript"]} uniqueName="Lang1"
                        selectCallback={callback1}></HoverSelect>
                </div>
                <div className="choiceInput">
                    <div style={{height: "2rem", margin: "0", padding: "0"}}><label >Language 2:</label></div>
                    <HoverSelect choices={["C#", "Typescript"]} uniqueName="Lang2" 
                        selectCallback={callback2}></HoverSelect>
                    
                </div>
                <div className="choiceInputButton">
                    ↩ Previous
                </div>
                <div className="choiceInputButton headerRightmost">
                    ↪ Next
                </div>
            </div>
        </nav>
      );
}

export default Header