import { useContext, useEffect, useState } from "react"
import "./hoverSelect.css"
import { html } from 'htm/react'
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import {observer} from 'mobx-react-lite'
import SelectChoice from "../../../common/types/SelectChoice"
import SelectGroup from "../../../common/types/SelectGroup"


type Props = {
    choiceGroups: SelectGroup[],
    uniqueName: string,
    selectCallback: (c: SelectChoice) => void,
}

const HoverGroupSelect: React.FunctionComponent<Props> = observer(({choiceGroups, uniqueName, selectCallback, }) => {
    const [currValue, setCurrValue] = useState({id: 0, name: ""})
    const mainState = useContext<MainState>(StoreContext)
    const currentlyOpen = mainState.app.openSelect
    const isOpen = currentlyOpen === uniqueName

    // const [selectedGroup, setSelectedGroup] = useState<SelectGroup>(((x: SelectGroup[]) => x.length > 0 ? ({id: x[0].id, name: x[0].name, choices: x[0].choices}) : {id: -1, name: "", choices: [], })(choiceGroups))
    const [selectedGroup, setSelectedGroup] = useState<SelectGroup>(choiceGroups.length > 0 ? choiceGroups[0] : {id: -1, name: "", choices: [], })

    useEffect(() => {
        if (choiceGroups.length > 0) {
            setSelectedGroup(choiceGroups[0])
        }
    }, [choiceGroups])

    const [groupSelectMode, setGroupSelectMode] = useState(false)
    const onSelect = (c: SelectChoice) => {
        setCurrValue(c)
        selectCallback(c)
        mainState.app.setOpenSelect("")
    }

    const onClickHeader = () => {
        if (isOpen) {
            mainState.app.setOpenSelect("")            
        } else {
            mainState.app.setOpenSelect(uniqueName)
        }
    }

    const onClickGroup = () => {
        setGroupSelectMode(!groupSelectMode)
    }

    const onSelectGroup = (idx: number) => {
        console.log(`onSelectGroup ${idx}`)
        setSelectedGroup(choiceGroups[idx])
        setGroupSelectMode(false)
    }

    return html`
        <div class="hoverSelect" onMouseEnter=${() => mainState.app.setOpenSelect(uniqueName)}
                onMouseLeave=${() => mainState.app.setOpenSelect("")}>            
            <span class="search" onClick=${onClickHeader}>
                <span class="leftButton"></span>
                <span class="rightLabel">${currValue.name}</span>
            </span>
            
            <div class=${(isOpen ? "hoverSelectMenuActive" : "hoverSelectMenu")}>
                <div class="groupName" onClick=${onClickGroup}>Selected group: ${selectedGroup.name}</div>
                ${ groupSelectMode === true &&
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
                ${ groupSelectMode === false &&
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