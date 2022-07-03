import React from "react"
import { useContext, useEffect, useState } from "react"
import "./hoverSelect.css"
import MainState from "../../mobX/AllState"
import { storeContext } from "../../App"
import {observer} from 'mobx-react-lite'
import SelectChoice from "../../types/SelectChoice"


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
    const mainState = useContext<MainState>(storeContext)
    const currentlyOpen = mainState.snip.openSelect
    const isOpen = currentlyOpen === uniqueName
    const [currValue, setCurrValue] = useState<SelectChoice>(initValue)

    useEffect(() => {
        setCurrValue(initValue)
    }, [initValue] )

    const onSelect = (c: SelectChoice) => {
        setCurrValue(c)
        mainState.snip.openSelectSet("")
    }

    const onClickHeader = () => {
        if (isOpen) {
            mainState.snip.openSelectSet("")
        } else {
            mainState.snip.openSelectSet(uniqueName)
        }
    }

    const onMouseEnterH = () => {
        mainState.snip.openSelectSet(uniqueName)
    }

    return (
        <div key={inputName} onMouseLeave={() => mainState.snip.openSelectSet("")} className={"hoverSelectInputContainer"}>
            <input type="text" name={inputName} readOnly value={currValue.name} className="hoverSelectSmall"
                onMouseEnter={onMouseEnterH}
                />
            <span className="search" onClick={onClickHeader}>
            </span>

            {isOpen === true && (

                    <div className={(isOpen ? "hoverSelectInputMenuActive" : "hoverSelectInputMenu")}>
                        <ul className={"hoverSelectInputFields"}>
                            {choices.map((c: SelectChoice, idx: number) => {
                                    return <li key={idx} onClick={() => onSelect(c)} className="hoverSelectInputField">{c.name}</li>
                                }
                            )}
                        </ul>
                    </div>
                )
            }
        </div>

    )
})


export default HoverSelectInput
