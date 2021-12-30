import { useContext } from "react"
import "./hoverSelect.css"
import { html } from 'htm/react'
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import {observer} from 'mobx-react-lite'
import SelectChoice from "../../types/SelectChoice"


type Props = {
    choices: SelectChoice[],
    currValue: SelectChoice,
    uniqueName: string,
    selectCallback: (c: SelectChoice) => void,
}

const HoverSelect: React.FunctionComponent<Props> = observer(({choices, currValue, uniqueName, selectCallback, }) => {
    
    const mainState = useContext<MainState>(StoreContext)
    const currentlyOpen = mainState.app.openSelect
    const isOpen = currentlyOpen === uniqueName

    const onSelect = (c: SelectChoice) => {
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
                <ul class="list">
                    <li>
                        <ul class="optgroup">
                            ${choices.map((c: SelectChoice, idx: number) => {
                                return html`<li key=${idx} onClick=${() => onSelect(c)}>${c.name}</li>`
                            })}
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    `
})


export default HoverSelect