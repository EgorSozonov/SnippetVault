import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { SVState } from "../../redux/state"
import "./toggler.css"


type Props = {
    leftChoice: string,
    rightChoice: string,
    initChosen: boolean,
}

const Toggler: React.FunctionComponent<Props> = ({leftChoice, rightChoice, initChosen}) => {
    const [currValue, setCurrValue] = useState(initChosen)

    return (
        <div className="togglerContainer" onClick={() => setCurrValue(!currValue)}>
            <span className={"togglerLeftRect " + (currValue ? "togglerLeftRectInactive" : "togglerLeftRectActive")}></span>
            <span className={"togglerChoice" + (currValue ? " inactiveChoice" : " activeChoiceLeft")}>
                {leftChoice}
            </span>
            <span className={"toggleSwitch " + (currValue ? "on" : "off")}>
                <div ></div>
            </span>

            <span className={"togglerChoice" + (currValue ? " activeChoiceRight" : " inactiveChoice")}>
                {rightChoice}
            </span>
            <span className={"togglerRightRect " + (currValue ? " togglerRightRectActive" : "togglerRightRectInactive")}></span>
        </div>
    )
}


export default Toggler