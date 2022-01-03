import { FunctionComponent, useContext, useEffect, useRef } from "react"
import { html } from "htm/react"
import { observer } from "mobx-react-lite"
import { StoreContext } from "../../App"
import MainState from "../../mobX/MainState"
import { SignInAdminDTO, SignInDTO } from "../../types/dto/AuthDTO"


const AdminLogin: FunctionComponent = observer(({}: any) => {
    const state = useContext<MainState>(StoreContext)
    const unameRef = useRef<HTMLInputElement>(null)
    const pw1Ref = useRef<HTMLInputElement>(null)
    const pw2Ref = useRef<HTMLInputElement>(null)

    const signInOrRegisterHandler = async () => {
        if (!unameRef.current || !pw1Ref.current || !pw2Ref.current) return
        const uName: string = unameRef.current.value
        const pw1: string = pw1Ref.current.value
        const pw2: string = pw2Ref.current.value
        const dto: SignInAdminDTO = {userName: uName, password1: pw1, password2: pw2, }

        const response = await state.app.client.adminSignIn(dto)
        if (response.isOK === true) {
            
            const userData = response.value[0]
            console.log("is OK")
            console.log(userData)
            state.user.signInAdmin(userData.userId, userData.accessToken, uName)
        } else {
            console.log(response.errMsg)
        }
    }

    return html`
        <div class="loginForm">
            <div>
                Log in as an administrator:
            </div>
            
            <div class="loginFormLabel">Username</div>
            <input class="loginFormInput" ref=${unameRef} type="text" />
                            
            <div class="loginFormLabel">Password 1</div>
            <input class="loginFormInput" type="password" ref=${pw1Ref} />

            <div class="loginFormLabel">Password 2</div>
            <input class="loginFormInput" type="password" ref=${pw2Ref} />
            
            <div class="loginFormButtons">
                <button onClick=${signInOrRegisterHandler}>Sign in</button>
            </div>
        </div>
    `
})

export default AdminLogin