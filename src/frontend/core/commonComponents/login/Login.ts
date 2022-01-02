import { useContext, useRef, useState } from "react"
import "./Login.css"
import { html } from "htm/react"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import {observer} from "mobx-react-lite"
import SelectChoice from "../../types/SelectChoice"
import { SignInDTO } from "../../types/dto/AuthDTO"


type Props = {
    choices: SelectChoice[],
    currValue: SelectChoice,
    selectCallback: (c: SelectChoice) => void,
}

const Login: React.FunctionComponent<Props> = observer(({choices, currValue, selectCallback, }) => {    
    const state = useContext<MainState>(StoreContext)
    const unameRef = useRef<HTMLInputElement>(null)
    const pwRef = useRef<HTMLInputElement>(null)
    const signInHandler = async (e: any) => {
        if (!unameRef.current || !pwRef.current) return
        const uName: string = unameRef.current.value
        const pw: string = pwRef.current.value
        const dto: SignInDTO = {userName: uName, password: pw, }

        const response = await state.app.client.userSignIn(dto)
        console.log("response")
        console.log(response)
        if (response.isOK === true) {
            console.log(response.value[0])
        } else {
            console.log(response.errMsg)
        }
        
    }

    const registerHandler = async (e: any) => {
        if (!unameRef.current || !pwRef.current) return
        const uName: string = unameRef.current.value
        const pw: string = pwRef.current.value
        const dto: SignInDTO = {userName: uName, password: pw, }

        const res = await state.app.client.userRegister(dto)
        console.log("result")
        console.log(res)
    }

    return html`
        <div class="loginForm">
            <div>
                Log in to provide code proposals:
            </div>
            
            <div class="loginFormLabel">Username</div>
            <input class="loginFormInput" ref=${unameRef} type="text" />
                            
            <div class="loginFormLabel">Password</div>
            <input class="loginFormInput" ref=${pwRef} type="text" />
            
            <div class="loginFormButtons">
                <button onClick=${signInHandler}>Sign in</button>
                <button onClick=${registerHandler}>Register</button>
            </div>
        </div>
    `
})


export default Login