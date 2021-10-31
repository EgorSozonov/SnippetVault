import { useContext, useState } from "react"
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
    const [selectedGroup, setSelectedGroup] = useState<SelectGroup>(choiceGroups.length > 0 ? choiceGroups[0] : {id: -1, name: "", choices: [])

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
    return html`
        <div class="hoverSelect" onMouseEnter=${() => mainState.app.setOpenSelect(uniqueName)}
                onMouseLeave=${() => mainState.app.setOpenSelect("")}>            
            <span class="search" onClick=${onClickHeader}>
                <span class="leftButton"></span>
                <span class="rightLabel">${currValue.name}</span>
            </span>
            
            <div class=${(isOpen ? "hoverSelectMenuActive" : "hoverSelectMenu")}>
                <div>${selectedGroup.name}</div>
                <ul class="list">
                    <li>
                        <ul class="optgroup">
                            ${selectedGroup.choices.map((c: SelectChoice, idx: number) => {
                                return html`<li key=${idx} onClick=${() => onSelect(c)}>${c.name}</li>`
                            })}
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    `
})


export default HoverGroupSelect