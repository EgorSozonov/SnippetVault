import { useContext, useRef, useState } from "react"
import "./Login.css"
import { html } from "htm/react"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import {observer} from "mobx-react-lite"
import SelectChoice from "../../types/SelectChoice"
import { SignInDTO } from "../../types/dto/AuthDTO"


const Login: React.FunctionComponent = observer(() => {    
    const state = useContext<MainState>(StoreContext)
    const unameRef = useRef<HTMLInputElement>(null)
    const pwRef = useRef<HTMLInputElement>(null)
    const signInOrRegisterHandler = (isRegistering: boolean) => async () => {
        if (!unameRef.current || !pwRef.current) return
        const uName: string = unameRef.current.value
        const pw: string = pwRef.current.value
        const dto: SignInDTO = {userName: uName, password: pw, }

        const response = isRegistering === true ? await state.app.client.userRegister(dto) : await state.app.client.userSignIn(dto)
        if (response.isOK === true) {
            const userData = response.value[0]
            state.user.signIn(userData.userId, userData.accessToken, uName)
        } else {
            console.log(response.errMsg)
        }
    }

    return html`
        <div class="loginForm">
            <div>
                Log in to provide code proposals:
            </div>
            
            <div class="loginFormLabel">Username</div>
            <input class="loginFormInput" ref=${unameRef} type="text" />
                            
            <div class="loginFormLabel">Password</div>
            <input class="loginFormInput" type="password" ref=${pwRef} />
            
            <div class="loginFormButtons">
                <button onClick=${signInOrRegisterHandler(false)}>Sign in</button>
                <button onClick=${signInOrRegisterHandler(true)}>Register</button>
            </div>
        </div>
    `
})


export default Login