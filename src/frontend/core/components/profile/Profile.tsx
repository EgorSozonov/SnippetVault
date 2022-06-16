import React from "react"
import "./profile.css"
import { useContext, useEffect, useRef, useState } from "react"
import MainState from "../../mobX/AllState"
import { storeContext } from "../../App"
import { SignInDTO, ChangePwDTO } from "../../types/dto/AuthDTO"
import { observer } from "mobx-react-lite"
import Login from "../../commonComponents/login/Login"
import { fmtDt } from "../../utils/DateUtils"


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
        const mbUserId = state.user.userIdGet()
        if (mbUserId === null || state.user.acc === null) return

        if (!oldPwRef.current || !newPwRef.current) return
        const oldPw: string = oldPwRef.current.value
        const newPw: string = newPwRef.current.value

        const signInDTO: SignInDTO = {userName: state.user.acc?.name, password: oldPw, }

        const dto: ChangePwDTO = { newPw: newPw, signIn: signInDTO, }
        await state.user.changePw(dto, mbUserId)
        setChangePwMode(false)
    }

    useEffect(() => {
        state.user.trySignInFromLS()
        const mbUserId = state.user.userIdGet()
        if (mbUserId === null) return
        state.user.profileGet(mbUserId)
    }, [state.user.acc])

    const isUser = state.user.isUser.get()
    const oldPwRef = useRef<HTMLInputElement>(null)
    const newPwRef = useRef<HTMLInputElement>(null)

    const changePwMenu =
        <div>
            <div>Old password:</div>
            <div><input type="password" ref={oldPwRef} /></div>
            <div>New password:</div>
            <div><input type="password" ref={newPwRef} /></div>
            <div className="profileButtons">
                <div className="clickable" onClick={closeChangePwHandler}>Cancel</div>
                <div className="clickable" onClick={saveChangePwHandler}>Save</div>
            </div>
        </div>

    return (
        <div className="profileBackground">
            <div className="profileContainer">
                {(profile !== null && isUser === true && changePwMode === false)
                    ?   <>
                            <div className="profileHeader">
                                <div>
                                    <h2>{state.user.acc !== null && state.user.acc.name}</h2>
                                </div>
                                <div className="profileHeaderSubscript">
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
                    : (changePwMode === true
                        ? changePwMenu
                        : <Login />)
                }
            </div>
        </div>
    )
})

export default Profile
