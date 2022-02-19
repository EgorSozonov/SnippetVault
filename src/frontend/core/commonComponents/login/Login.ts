import { useContext, useRef, } from "react"
import "./Login.css"
import { html } from "htm/react"
import MainState from "../../mobX/AllState"
import { StoreContext } from "../../App"
import {observer} from "mobx-react-lite"
import { SignInDTO } from "../../types/dto/AuthDTO"
import { NavLink } from "react-router-dom"
import PATHS from "../../params/Path"


type Props = {
    closeCallback?: () => void,
}

const Login: React.FunctionComponent<Props> = observer(({ closeCallback }) => {
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
            <div class="loginTitle">
                Log in
            </div>
            <div class="loginCookieInfo">
                <p>
                This website uses cookies for identification of signed in users.
                </p>
                <p>By signing in you are consenting to our <${NavLink} to=${PATHS["termsOfService"].url} title="Terms of Service" exact="true">Terms of Service<//> and cookie usage policy.
                </p>
            </div>
            <div class="loginFormLabel">Username</div>
            <input class="loginFormInput" ref=${unameRef} type="text" />

            <div class="loginFormLabel">Password</div>
            <input class="loginFormInput" type="password" ref=${pwRef} />

            <div class="loginFormButtons">
                ${closeCallback && html`<div class="loginFormButton" onClick=${closeCallback}>Cancel</div>`}
                <div class="loginFormButton" onClick=${signInOrRegisterHandler("signIn")}>Sign in</button>
                <div class="loginFormButton" onClick=${signInOrRegisterHandler("register")}>Register</button>
            </div>
        </div>
    `
})


export default Login
