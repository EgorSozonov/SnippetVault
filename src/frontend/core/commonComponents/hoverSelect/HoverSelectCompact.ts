import { useContext } from "react"
import "./hoverSelect.css"
import { html } from 'htm/react'
import MainState from "../../mobX/AllState"
import { StoreContext } from "../../App"
import {observer} from 'mobx-react-lite'
import SelectChoice from "../../types/SelectChoice"


type Props = {
    choices: SelectChoice[],
    currValue: SelectChoice,
    uniqueName: string,
    selectCallback: (c: SelectChoice) => void,
}

const HoverSelectCompact: React.FunctionComponent<Props> = observer(({choices, currValue, uniqueName, selectCallback, }) => {
    const mainState = useContext<MainState>(StoreContext)
    const currentlyOpen = mainState.snip.openSelect
    const isOpen = currentlyOpen === uniqueName

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
    return html`
        <div class="hoverSelect" onMouseEnter=${() => mainState.snip.openSelectSet(uniqueName)}
                onMouseLeave=${() => mainState.snip.openSelectSet("")}>
            <span class="searchCompact" onClick=${onClickHeader}>
                <svg width="30" height="30" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15" cy="15" r="14" fill="transparent" stroke-width="1" />
                    <path d="M 8 13 L 15 22 L 22 13" stroke="hsl(0, 0%, 80%)" />
                    <path d="M 11 11 L 15 16 L 19 11" stroke="hsl(0, 0%, 70%)" />
                </svg>
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


export default HoverSelectCompact
