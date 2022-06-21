import { FunctionComponent, useContext, useEffect, useRef } from "react"
import React from "react"
import { observer } from "mobx-react-lite"
import { storeContext } from "../../App"
import MainState from "../../mobX/AllState"
import { SignInDTO } from "../../types/dto/AuthDTO"


const AdminLogin: FunctionComponent = observer(({}: any) => {
    const state = useContext<MainState>(storeContext)
    const unameRef = useRef<HTMLInputElement>(null)
    const pwRef = useRef<HTMLInputElement>(null)

    const signInHandler = async () => {
        if (!unameRef.current || !pwRef.current) return
        const uName: string = unameRef.current.value
        const pw: string = pwRef.current.value

        await state.user.userSignIn(uName, pw, "admin")
    }

    return (
        <div className="adminLoginForm">
            <div>
                Log in as an administrator:
            </div>
            <div>
                This website uses cookies for identification of signed in users. By signing in you are consenting to our cookie use policy.
            </div>

            <div className="adminLoginLabel">Username</div>
            <input className="loginFormInput" ref={unameRef} type="text" />

            <div className="adminLoginLabel">Password</div>
            <input className="loginFormInput" type="password" ref={pwRef} />

            <div className="adminLoginButtons">
                <button onClick={signInHandler}>Sign in</button>
            </div>
        </div>
    )
})

export default AdminLogin
