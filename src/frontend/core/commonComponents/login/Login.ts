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
        mainState.user.setUserStatus("user")
    }
    return html`
        <div>
            <form class="loginForm" onSubmit=${signInHandler}>
                <div>
                    Log in to provide code proposals:
                </div>
                <div>
                    <label>Username</label>
                    <input name="login" type="text" />
                </div>
                <div>
                    <label>Password</label>
                    <input name="pw" type="text" />
                </div>
                <div>
                    <button>Sign in</button>
                </div>
            </form>            
        </div>
    `
})


export default Login