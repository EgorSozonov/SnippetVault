import { useState } from "react"
import "./toggler.css"
import { html } from "htm/react"


type Props = {
    leftChoice: string,
    rightChoice: string,
    initChosen: boolean,
    leftCallback: () => void,
    rightCallback: () => void,
}

const Toggler: React.FunctionComponent<Props> = ({leftChoice, rightChoice, initChosen, leftCallback, rightCallback, }) => {
    const [currValue, setCurrValue] = useState(initChosen)
    const changeHandler = () => {
        if (currValue === true) {
            setCurrValue(false)
            leftCallback()
        } else {
            setCurrValue(true)
            rightCallback()
        }
    }

    return
        <div className="togglerContainer" onClick=${changeHandler}>
            <span className=${"togglerLeftRect " + (currValue ? "togglerLeftRectInactive" : "togglerLeftRectActive")}></span>
            <span className=${"togglerChoice" + (currValue ? " inactiveChoice" : " activeChoiceLeft")}>
                ${leftChoice}
            </span>
            <span className=${"toggleSwitch " + (currValue ? "on" : "off")}>
                <div ></div>
            </span>

            <span className=${"togglerChoice" + (currValue ? " activeChoiceRight" : " inactiveChoice")}>
                ${rightChoice}
            </span>
            <span className=${"togglerRightRect " + (currValue ? " togglerRightRectActive" : "togglerRightRectInactive")}></span>
        </div>
    `
}

export default Toggler
