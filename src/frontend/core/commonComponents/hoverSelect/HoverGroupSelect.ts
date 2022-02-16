import { useContext, useEffect, useState } from "react"
import "./hoverSelect.css"
import { html } from 'htm/react'
import MainState from "../../mobX/AllState"
import { StoreContext } from "../../App"
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
    const mainState = useContext<MainState>(StoreContext)
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

    return html`
        <div class="hoverSelect" onMouseEnter=${() => mainState.snip.openSelectSet(uniqueName)}
                onMouseLeave=${() => mainState.snip.openSelectSet("")}>
            <span class="search" onClick=${onClickHeader}>
                <span class="leftButton"></span>
                <span class="rightLabel">${currValue.name}</span>
            </span>

            <div class=${(isOpen ? "hoverSelectMenuActive" : "hoverSelectMenu")}>
                <div class=${"groupName" + (groupSelectMode === true ? " groupNameSelectMode": "")}
                    onClick=${onClickGroup}>[${selectedGroup.name}]</div>
                ${groupSelectMode === true &&
                    html`<ul class="list">
                        <li>
                            <ul class="optgroup">
                                ${choiceGroups.map((c: SelectGroup, idx: number) => {
                                    return html`<li key=${idx} onClick=${() => onSelectGroup(idx)}>${c.name}</li>`
                                })}
                            </ul>
                        </li>
                    </ul>`
                }
                ${groupSelectMode === false &&
                    html`<ul class="list">
                        <li>
                            <ul class="optgroup">
                                ${selectedGroup.choices.map((c: SelectChoice, idx: number) => {
                                    return html`<li key=${idx} onClick=${() => onSelect(c)}>${c.name}</li>`
                                })}
                            </ul>
                        </li>
                    </ul>`
                }
            </div>
        </div>
    `
})


export default HoverGroupSelect
