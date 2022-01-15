import { useContext, useRef, useState } from "react"
import "./Login.css"
import { html } from "htm/react"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import {observer} from "mobx-react-lite"

import { SignInDTO } from "../../components/dto/AuthDTO"


const Login: React.FunctionComponent = observer(() => {    
    const state = useContext<MainState>(StoreContext)
    const unameRef = useRef<HTMLInputElement>(null)
    const pwRef = useRef<HTMLInputElement>(null)
    const signInOrRegisterHandler = (mode: "signIn" | "register") => async () => {
        if (!unameRef.current || !pwRef.current) return
        const uName: string = unameRef.current.value
        const pw: string = pwRef.current.value
        const dto: SignInDTO = {userName: uName, password: pw, }

        state.user.signInOrRegister(dto, mode)        
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
                <button onClick=${signInOrRegisterHandler("signIn")}>Sign in</button>
                <button onClick=${signInOrRegisterHandler("register")}>Register</button>
            </div>
        </div>
    `
})


export default Login