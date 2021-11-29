import { useContext, useState } from "react"
import "./login.css"
import { html } from 'htm/react'
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import {observer} from 'mobx-react-lite'
import SelectChoice from "../../../common/types/SelectChoice"


type Props = {
    choices: SelectChoice[],
    currValue: SelectChoice,
    uniqueName: string,
    selectCallback: (c: SelectChoice) => void,
}

const Login: React.FunctionComponent<Props> = observer(({choices, currValue, uniqueName, selectCallback, }) => {
    
    const mainState = useContext<MainState>(StoreContext)
    const signInHandler = (e: any) => {
        console.log("sign in")
        console.log(e)
    }
    return html`
        <div>
            <form onSubmit=${signInHandler}>
                <input name="login" type="text" />
                <input name="pw" type="text" />
                <button>Sign in</button>
            </form>            
        </div>
    `
})


export default Login