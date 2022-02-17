import "./profile.css"
import { html } from "htm/react"
import { useContext, useEffect, useRef, useState } from "react"
import MainState from "../../mobX/AllState"
import { StoreContext } from "../../App"
import { SignInDTO, ChangePwDTO } from "../../types/dto/AuthDTO"
import { observer } from "mobx-react-lite"
import Login from "../../commonComponents/login/Login"
import { fmtDt } from "../../utils/DateUtils"


const Profile: React.FunctionComponent = observer(() => {
    const state = useContext<MainState>(StoreContext)
    const [changePwMode, setChangePwMode] = useState(false)

    const profile = state.user.profile

    const signOutHandler = () => {
        state.user.signOut()
    }

    const openChangePwHandler = () => {
        setChangePwMode(true)
    }

    const closeChangePwHandler = () => {
        setChangePwMode(false)
    }

    const saveChangePwHandler = async () => {
        const headers = state.user.headersGet()
        if (headers === null || state.user.acc === null) return

        if (!oldPwRef.current || !newPwRef.current) return
        const oldPw: string = oldPwRef.current.value
        const newPw: string = newPwRef.current.value

        const signInDTO: SignInDTO = {userName: state.user.acc?.name, password: oldPw, }

        const dto: ChangePwDTO = { newPw: newPw, signIn: signInDTO, }
        await state.user.changePw(dto, headers)
        setChangePwMode(false)
    }

    useEffect(() => {
        state.user.trySignInFromLS()
        const headers = state.user.headersGet()
        if (headers === null) return
        state.user.profileGet(headers)
    }, [state.user.acc])

    const isUser = state.user.isUser.get()
    const oldPwRef = useRef<HTMLInputElement>(null)
    const newPwRef = useRef<HTMLInputElement>(null)

    const changePwMenu = html`
        <div>
            <div>Old password:</div>
            <div><input type="password" ref=${oldPwRef} /></div>
            <div>New password:</div>
            <div><input type="password" ref=${newPwRef} /></div>
            <div class="profileButtons">
                <div class="clickable" onClick=${closeChangePwHandler}>Cancel</div>
                <div class="clickable" onClick=${saveChangePwHandler}>Save</div>
            </div>
        </div>
    `
    return html`
        <div class="profileBackground">
            <div class="profileContainer">
                ${(profile !== null && isUser === true && changePwMode === false)
                    ? html`
                        <div class="profileHeader">
                            <div>
                                <h2>${state.user.acc !== null && state.user.acc.name}</h2>
                            </div>
                            <div class="profileHeaderSubscript">
                                <h5>User Profile</h5>
                            </div>
                            <div class="profileChangePasswordButton clickable" title="Change password" onClick=${openChangePwHandler}>Pw
                            </div>
                        </div>
                        <div>Registration date: ${fmtDt(profile.tsJoined)}</div>
                        <div>Total number of proposals: ${profile.proposalCount}</div>
                        <div>Approved proposals: ${profile.approvedCount}</div>
                        <div>Approved proposals selected as primary: ${profile.primaryCount}</div>
                        <div onClick=${signOutHandler} class="profileSignOut">Sign out</div>
                    `
                    : (changePwMode === true
                        ? changePwMenu
                        : html `<${Login} />`)
                }
            </div>
        </div>
    `
})

export default Profile
