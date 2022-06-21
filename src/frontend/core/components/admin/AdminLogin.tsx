import { FunctionComponent, useContext, useEffect, useRef } from "react"
import React from "react"
import { observer } from "mobx-react-lite"
import { storeContext } from "../../App"
import MainState from "../../mobX/AllState"
import { SignInDTO } from "../../types/dto/AuthDTO"


const AdminLogin: FunctionComponent = observer(({}: any) => {
    const state = useContext<MainState>(storeContext)
    const unameRef = useRef<HTMLInputElement>(null)
    const pw1Ref = useRef<HTMLInputElement>(null)
    const pw2Ref = useRef<HTMLInputElement>(null)


    const signInOrRegisterHandler = async () => {
        if (!unameRef.current || !pw1Ref.current || !pw2Ref.current) return
        const uName: string = unameRef.current.value
        const pw: string = pw1Ref.current.value
        const dto: SignInDTO = {userName: uName, password: pw, }

        const mbAcc = state.user.signIn(dto)

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

            <div className="adminLoginLabel">Password 1</div>
            <input className="loginFormInput" type="password" ref={pw1Ref} />

            <div className="adminLoginLabel">Password 2</div>
            <input className="loginFormInput" type="password" ref={pw2Ref} />

            <div className="adminLoginButtons">
                <button onClick={signInOrRegisterHandler}>Sign in</button>
            </div>
        </div>
    )
})

export default AdminLogin
