import { useContext, useState } from "react"
import "./hoverSelect.css"
import { html } from 'htm/react'
import MainState from "../../MobX/MainState"
import { StoreContext } from "../../app"


type Props = {
    choices: string[],
    uniqueName: string,
    selectCallback: (c: string) => void,
}

const HoverSelect: React.FunctionComponent<Props> = ({choices, uniqueName, selectCallback, }) => {
    const [currValue, setCurrValue] = useState(" ")
    const mainState = useContext<MainState>(StoreContext)
    const currentlyOpen = mainState.app.openSelect
    const isOpen = currentlyOpen === uniqueName

    const onSelect = (c: string) => {
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
                <span class="rightLabel">${currValue}</span>
            </span>
            
            <div class=${(isOpen ? "hoverSelectMenuActive" : "hoverSelectMenu")}>
                <ul class="list">
                    <li>
                        <ul class="optgroup">
                            ${choices.map((c: string, idx: number) => {
                                return html`<li key=${idx} onClick=${() => onSelect(c)}>${c}</li>`
                            })}
                        </ul>
                    </li>
                </ul>
            </div>
                
            
        </div>
    `
}


export default HoverSelect