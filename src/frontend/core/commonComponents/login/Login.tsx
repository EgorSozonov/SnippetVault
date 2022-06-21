import React from "react"
import { useContext, useRef, } from "react"
import "./Login.css"
import MainState from "../../mobX/AllState"
import { storeContext } from "../../App"
import {observer} from "mobx-react-lite"
import { NavLink } from "react-router-dom"
import PATHS from "../../Path"


type Props = {
    closeCallback?: () => void,
}

const Login: React.FunctionComponent<Props> = observer(({ closeCallback }) => {
    const state = useContext<MainState>(storeContext)

    const unameRef = useRef<HTMLInputElement>(null)
    const pwRef = useRef<HTMLInputElement>(null)
    const signInOrRegisterHandler = (mode: "signIn" | "register") => async () => {
        if (!unameRef.current || !pwRef.current) return
        const uName: string = unameRef.current.value
        const pw: string = pwRef.current.value

        if (mode === "signIn") {
            await state.user.userSignIn(uName, pw, "user")
        } else {
            await state.user.userRegister(uName, pw)
        }
    }

    return (
        <div className="loginForm">
            <div className="loginTitle">
                Log in
            </div>
            <div className="loginCookieInfo">
                <p>
                This website uses cookies for identification of signed in users.
                </p>
                <p>By signing in you are consenting to our <NavLink to={PATHS["termsOfService"].url} title="Terms of Service" >Terms of Service</NavLink> and cookie usage policy.
                </p>
            </div>
            <div className="loginFormLabel">Username</div>
            <input className="loginFormInput" ref={unameRef} type="text" />

            <div className="loginFormLabel">Password</div>
            <input className="loginFormInput" type="password" ref={pwRef} />

            <div className="loginFormButtons">
                {closeCallback && <div className="loginFormButton" onClick={closeCallback}>Cancel</div>}
                <div className="loginFormButton" onClick={signInOrRegisterHandler("signIn")}>Sign in</div>
                <div className="loginFormButton" onClick={signInOrRegisterHandler("register")}>Register</div>
            </div>
        </div>
    )
})


export default Login
