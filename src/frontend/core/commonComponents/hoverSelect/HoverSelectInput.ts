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

/** 
 * Hover select build upon an <input> element, good for <form>s
 */
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

    const onMouseEnterH = () => {
        mainState.app.setOpenSelect(uniqueName)
    }

    return html`
        <div key=${inputName} onMouseLeave=${() => mainState.app.setOpenSelect("")} class=${"hoverSelectInputContainer"}>
            <input type="text" name=${inputName} readOnly value=${currValue.name} class="hoverSelectSmall" 
                onMouseEnter=${onMouseEnterH}
                />       
            <span class="search" onClick=${onClickHeader}>
            </span>
                           
            ${isOpen === true && 
                html `
                    <div class=${(isOpen ? "hoverSelectInputMenuActive" : "hoverSelectInputMenu")}>                    
                        <ul class=${"hoverSelectInputFields"}>
                            ${choices.map((c: SelectChoice, idx: number) => {
                                    return html`<li key=${idx} onClick=${() => onSelect(c)} class="hoverSelectInputField">${c.name}</li>`
                                }
                            )} 
                        </ul>                    
                    </div>
                `
            }            
        </div>
    
    `
})


export default HoverSelectInput