import React from "react"
import { useContext, useEffect, useState } from "react"
import "./hoverSelect.css"
import MainState from "../../mobX/AllState"
import { storeContext } from "../../App"
import {observer} from 'mobx-react-lite'
import SelectChoice from "../../types/SelectChoice"
import SelectGroup from "../../types/SelectGroup"


type Props = {
    choiceGroups: SelectGroup[],
    currValue: SelectChoice,
    uniqueName: string,
    selectCallback: (c: SelectChoice) => void,
}

const HoverGroupSelect: React.FunctionComponent<Props> = observer(({choiceGroups, currValue, uniqueName, selectCallback, }) => {
    const mainState = useContext<MainState>(storeContext)
    const currentlyOpen = mainState.snip.openSelect
    const isOpen = currentlyOpen === uniqueName
    const [selectedGroup, setSelectedGroup] = useState<SelectGroup>(choiceGroups.length > 0 ? choiceGroups[0] : {id: -1, name: "", choices: [], })

    useEffect(() => {
        if (choiceGroups.length > 0) {
            setSelectedGroup(choiceGroups[0])
        }
    }, [choiceGroups])

    const [groupSelectMode, setGroupSelectMode] = useState(false)
    const onSelect = (c: SelectChoice) => {
        selectCallback(c)
        mainState.snip.openSelectSet("")
    }

    const onClickHeader = () => {
        if (isOpen) {
            mainState.snip.openSelectSet("")
        } else {
            mainState.snip.openSelectSet(uniqueName)
        }
    }

    const onClickGroup = () => {
        setGroupSelectMode(!groupSelectMode)
    }

    const onSelectGroup = (idx: number) => {
        setSelectedGroup(choiceGroups[idx])
        setGroupSelectMode(false)
    }

    return (
        <div className="hoverSelect" onMouseEnter={() => mainState.snip.openSelectSet(uniqueName)}
                onMouseLeave={() => mainState.snip.openSelectSet("")}>
            <span className="search" onClick={onClickHeader}>
                <span className="leftButton"></span>
                <span className="rightLabel">{currValue.name}</span>
            </span>

            <div className={(isOpen ? "hoverSelectMenuActive" : "hoverSelectMenu")}>
                <div className={"groupName" + (groupSelectMode === true ? " groupNameSelectMode": "")}
                    onClick={onClickGroup}>[{selectedGroup.name}]</div>
                {groupSelectMode === true &&
                    <ul className="list">
                        <li>
                            <ul className="optgroup">
                                {choiceGroups.map((c: SelectGroup, idx: number) => {
                                    return <li key={idx} onClick={() => onSelectGroup(idx)}>{c.name}</li>
                                })}
                            </ul>
                        </li>
                    </ul>
                }
                {groupSelectMode === false &&
                    <ul className="list">
                        <li>
                            <ul className="optgroup">
                                {selectedGroup.choices.map((c: SelectChoice, idx: number) => {
                                    return <li key={idx} onClick={() => onSelect(c)}>{c.name}</li>
                                })}
                            </ul>
                        </li>
                    </ul>
                }
            </div>
        </div>
    )
})


export default HoverGroupSelect
