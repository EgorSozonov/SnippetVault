import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { SVState } from "../../redux/state"
import "./hoverSelect.css"


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
    return (
        <div className="hoverSelect" onMouseEnter={() => dispatch({type: "changeSelect", payload: {selectName: uniqueName, }})}
                onMouseLeave={() => dispatch({type: "changeSelect", payload: {selectName: "", }})}>            
            <span className="search" onClick={onClickHeader}>
                <span className={"leftButton" + (isOpen ? " hoverSelectActive" : " hoverSelectInactive")}>(-)</span>
                <span className={"rightLabel"}>{currValue}</span>
            </span>
            {isOpen && 
                <div className="menu">
                    <ul className="list">
                        <li>
                            <ul className="optgroup">
                                {choices.map((c: string, idx: number) => {
                                    return (<li key={idx} onClick={() => onSelect(c)}>{c}</li>)
                                })}
                            </ul>
                        </li>
                    </ul>
                </div>
            }
        </div>
    )
}


export default HoverSelect