import { useContext, useEffect, useState } from "react"
import "./hoverSelect.css"
import { html } from 'htm/react'
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import {observer} from 'mobx-react-lite'
import SelectChoice from "../../../common/types/SelectChoice"


type Props = {
    choices: SelectChoice[],
    initValue: SelectChoice,
    uniqueName: string,
    inputName: string,
}

const HoverSelectInput: React.FunctionComponent<Props> = observer(({choices, initValue, uniqueName, inputName, }) => {    
    const mainState = useContext<MainState>(StoreContext)
    const currentlyOpen = mainState.app.openSelect
    const isOpen = currentlyOpen === uniqueName
    const [currValue, setCurrValue] = useState<SelectChoice>(initValue)

    useEffect(() => {
        setCurrValue(initValue)
    }, [initValue] )

    const onSelect = (c: SelectChoice) => {
        setCurrValue(c)
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
        <input type="text" name=${inputName} value=${currValue.name} class="hoverSelect" onMouseEnter=${() => mainState.app.setOpenSelect(uniqueName)}
                onMouseLeave=${() => mainState.app.setOpenSelect("")} />       
        <span class="search" onClick=${onClickHeader}>
        </span>
        
        <div class=${"hoverSelectMenuActive"}>
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
        
    `
})


export default HoverSelectInput