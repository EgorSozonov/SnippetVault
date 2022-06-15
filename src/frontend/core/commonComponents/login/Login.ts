import { useContext, useRef, } from "react"
import "./Login.css"
import { html } from "htm/react"
import MainState from "../../mobX/AllState"
import { StoreContext } from "../../App"
import {observer} from "mobx-react-lite"
import { SignInDTO } from "../../types/dto/AuthDTO"
import { NavLink } from "react-router-dom"
import PATHS from "../../Path"


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

    return
        <div className="loginForm">
            <div className="loginTitle">
                Log in
            </div>
            <div className="loginCookieInfo">
                <p>
                This website uses cookies for identification of signed in users.
                </p>
                <p>By signing in you are consenting to our <${NavLink} to=${PATHS["termsOfService"].url} title="Terms of Service" exact="true">Terms of Service<//> and cookie usage policy.
                </p>
            </div>
            <div className="loginFormLabel">Username</div>
            <input className="loginFormInput" ref=${unameRef} type="text" />

            <div className="loginFormLabel">Password</div>
            <input className="loginFormInput" type="password" ref=${pwRef} />

            <div className="loginFormButtons">
                ${closeCallback && <div className="loginFormButton" onClick=${closeCallback}>Cancel</div>`}
                <div className="loginFormButton" onClick=${signInOrRegisterHandler("signIn")}>Sign in</button>
                <div className="loginFormButton" onClick=${signInOrRegisterHandler("register")}>Register</button>
            </div>
        </div>
    `
})


export default Login
