import { useState } from "react"
import "./toggler.css"
import { html } from 'htm/react'


type Props = {
    leftChoice: string,
    rightChoice: string,
    initChosen: boolean,
}

const Toggler: React.FunctionComponent<Props> = ({leftChoice, rightChoice, initChosen}) => {
    const [currValue, setCurrValue] = useState(initChosen)

    return html`
        <div class="togglerContainer" onClick=${() => setCurrValue(!currValue)}>
            <span class=${"togglerLeftRect " + (currValue ? "togglerLeftRectInactive" : "togglerLeftRectActive")}></span>
            <span class=${"togglerChoice" + (currValue ? " inactiveChoice" : " activeChoiceLeft")}>
                ${leftChoice}
            </span>
            <span class=${"toggleSwitch " + (currValue ? "on" : "off")}>
                <div ></div>
            </span>

            <span class=${"togglerChoice" + (currValue ? " activeChoiceRight" : " inactiveChoice")}>
                ${rightChoice}
            </span>
            <span class=${"togglerRightRect " + (currValue ? " togglerRightRectActive" : "togglerRightRectInactive")}></span>
        </div>
    `
}


export default Toggler