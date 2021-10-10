import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { SVState } from "../../redux/state"
import "./hoverSelect.css"
import { html } from 'htm/react'


type Props = {
    choices: string[],
    uniqueName: string,
    selectCallback: (c: string) => void,
}

const HoverSelect: React.FunctionComponent<Props> = ({choices, uniqueName, selectCallback, }) => {
    const [currValue, setCurrValue] = useState(" ")
    const currentlyOpen = useSelector((state: SVState) => state.openSelect)
    const dispatch = useDispatch()
    const isOpen = currentlyOpen === uniqueName

    const onSelect = (c: string) => {
        setCurrValue(c)
        selectCallback(c)
        dispatch({type: "changeSelect", payload: {selectName: "", }})
    }

    const onClickHeader = () => {
        if (isOpen) {
            dispatch({type: "changeSelect", payload: {selectName: "", }})
        } else {
            dispatch({type: "changeSelect", payload: {selectName: uniqueName, }})
        }
    }
    return html`
        <div class="hoverSelect" onMouseEnter=${() => dispatch({type: "changeSelect", payload: {selectName: uniqueName, }})}
                onMouseLeave=${() => dispatch({type: "changeSelect", payload: {selectName: "", }})}>            
            <span class="search" onClick=${onClickHeader}>
                <span class=${"leftButton" + (isOpen ? " hoverSelectActive" : " hoverSelectInactive")}>(-)</span>
                <span class="rightLabel">${currValue}</span>
            </span>
            {isOpen && 
                <div class="menu">
                    <ul class="list">
                        <li>
                            <ul class="optgroup">
                                ${choices.map((c: string, idx: number) => {
                                    return html`<li key=${idx} onClick=${() => onSelect(c)}>{c}</li>`
                                })}
                            </ul>
                        </li>
                    </ul>
                </div>
            }
        </div>
    `
}


export default HoverSelect