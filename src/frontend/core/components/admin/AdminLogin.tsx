import { FunctionComponent, useContext, useEffect, useRef } from "react"
import React from "react"
import { observer } from "mobx-react-lite"
import { storeContext } from "../../App"
import MainState from "../../mobX/AllState"
import { SignInAdminDTO } from "../../types/dto/AuthDTO"
import { useCookies } from "react-cookie"


const AdminLogin: FunctionComponent = observer(({}: any) => {
    const state = useContext<MainState>(storeContext)
    const unameRef = useRef<HTMLInputElement>(null)
    const pw1Ref = useRef<HTMLInputElement>(null)
    const pw2Ref = useRef<HTMLInputElement>(null)
    const [cookies, setCookie] = useCookies(["account"]);

    const signInOrRegisterHandler = async () => {
        if (!unameRef.current || !pw1Ref.current || !pw2Ref.current) return
        const uName: string = unameRef.current.value
        const pw1: string = pw1Ref.current.value
        const pw2: string = pw2Ref.current.value
        const dto: SignInAdminDTO = {userName: uName, password1: pw1, password2: pw2, }

        const mbAcc = state.user.signInAdmin(dto)
        if (mbAcc !== null) {
            setCookie("account", JSON.stringify(mbAcc), { sameSite: "strict", httpOnly: true, secure: true, })
        }
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
