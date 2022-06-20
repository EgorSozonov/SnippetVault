import React from "react"
import "./profile.css"
import { useContext, useEffect, useRef, useState } from "react"
import MainState from "../../mobX/AllState"
import { storeContext } from "../../App"
import { SignInDTO, ChangePwDTO, RegisterDTO } from "../../types/dto/AuthDTO"
import { observer } from "mobx-react-lite"
import Login from "../../commonComponents/login/Login"
import { fmtDt } from "../../utils/DateUtils"
import { ProfileDTO } from "../../types/dto/UserDTO"
import { toast } from "react-toastify"


const Profile: React.FunctionComponent = observer(() => {
    const state = useContext<MainState>(storeContext)
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
        // TODO
        const mbUserId = state.user.userIdGet()
        if (mbUserId === null || state.user.acc === null) return

        if (!newPwRefRepeat.current || !newPwRef.current) return
        const newPwRepeat: string = newPwRefRepeat.current.value
        const newPw: string = newPwRef.current.value
        if (newPw.length < 8) {
            toast.error("Password must be at least 8 symbols in length!" , { autoClose: 4000 })
            return
        }
        if (newPw !== newPwRepeat) {
            toast.error("Passwords don't match!" , { autoClose: 4000 })
            return
        }

        const registerDTO: RegisterDTO = {userName: state.user.acc?.name, password: oldPw, }

        const dto: ChangePwDTO = { newPw: newPw, register: registerDTO }
        await state.user.changePw(dto)
        setChangePwMode(false)
    }

    useEffect(() => {
        state.user.trySignInFromLS()
        const mbUserId = state.user.userIdGet()
        if (mbUserId === null) return
        state.user.profileGet(mbUserId)
    }, [state.user.acc])

    const isUser = state.user.isUser.get()
    const newPwRef = useRef<HTMLInputElement>(null)
        const newPwRefRepeat = useRef<HTMLInputElement>(null)

    const changePwMenu =
        <div>
            <div>New password:</div>
            <div><input type="password" ref={newPwRef} /></div>
            <div>New password again:</div>
            <div><input type="password" ref={newPwRefRepeat} /></div>
            <div className="profileButtons">
                <div className="clickable" onClick={closeChangePwHandler}>Cancel</div>
                <div className="clickable" onClick={saveChangePwHandler}>Save</div>
            </div>
        </div>

    const profileView = (profile: ProfileDTO) =>
        <>
            <div className="profileHeader">
                <div>
                    <h2>{state.user.acc !== null && state.user.acc.name}</h2>
                </div>
                <div className="profilembUserIdubscript">
                    <h5>User Profile</h5>
                </div>
                <div className="profileChangePasswordButton clickable" title="Change password" onClick={openChangePwHandler}>Pw
                </div>
            </div>
            <div>Registration date: {fmtDt(profile.tsJoined)}</div>
            <div>Total number of proposals: {profile.proposalCount}</div>
            <div>Approved proposals: {profile.approvedCount}</div>
            <div>Approved proposals selected as primary: {profile.primaryCount}</div>
            <div onClick={signOutHandler} className="profileSignOut">Sign out</div>
        </>

    return (
        <div className="profileBackground">
            <div className="profileContainer">
                {(profile !== null && isUser === true && changePwMode === false)
                    ?  profileView(profile)
                    : (changePwMode === true
                        ? changePwMenu
                        : <Login />)
                }
            </div>
        </div>
    )
})

export default Profile
