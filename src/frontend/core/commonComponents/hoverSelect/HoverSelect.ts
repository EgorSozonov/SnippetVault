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

const HoverSelect: React.FunctionComponent<Props> = observer(({choices, currValue, uniqueName, selectCallback, }) => {
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
    return
        <div className="hoverSelect" onMouseEnter=${() => mainState.snip.openSelectSet(uniqueName)}
                onMouseLeave=${() => mainState.snip.openSelectSet("")}>
            <span className="search" onClick=${onClickHeader}>
                <span className="leftButton"></span>
                <span className="rightLabel">${currValue.name}</span>
            </span>

            <div className=${(isOpen ? "hoverSelectMenuActive" : "hoverSelectMenu")}>
                <ul className="list">
                    <li>
                        <ul className="optgroup">
                            ${choices.map((c: SelectChoice, idx: number) => {
                                return <li key=${idx} onClick=${() => onSelect(c)}>${c.name}</li>`
                            })}
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    `
})


export default HoverSelect
