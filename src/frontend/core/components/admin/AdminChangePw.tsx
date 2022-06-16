import { FunctionComponent, useContext, useRef } from "react"
import React from "react"
import { observer } from "mobx-react-lite"
import { storeContext } from "../../App"
import MainState from "../../mobX/AllState"
import { ChangePwAdminDTO, SignInAdminDTO } from "../../types/dto/AuthDTO"


type Props = {
    closeChangeAdminPwHandler: () => void,
}

const AdminLogin: FunctionComponent<Props> = observer(({closeChangeAdminPwHandler,  }: Props) => {
    const state = useContext<MainState>(storeContext)

    const oldPw1Ref = useRef<HTMLInputElement>(null)
    const oldPw2Ref = useRef<HTMLInputElement>(null)
    const newPwRef = useRef<HTMLInputElement>(null)

    const saveChangeAdminPwHandler = async () => {
        const headers = state.user.userIdGet()
        if (headers === null || state.user.acc === null) return

        if (!oldPw1Ref.current || !oldPw2Ref.current || !newPwRef.current) return
        const oldPw1: string = oldPw1Ref.current.value
        const oldPw2: string = oldPw2Ref.current.value
        const newPw: string = newPwRef.current.value

        const signInDTO: SignInAdminDTO = {userName: state.user.acc?.name, password1: oldPw1, password2: oldPw2, }

        const dto: ChangePwAdminDTO = { newPw, signIn: signInDTO, }

        await state.user.changeAdminPw(dto, headers)
        closeChangeAdminPwHandler()
    }

    return (
        <div className="adminChangePw">
            <div className="adminChangePwBlock">
                <div>Old password 1:</div>
                <div><input type="password" ref={oldPw1Ref} /></div>
                <div>Old password 2:</div>
                <div><input type="password" ref={oldPw2Ref} /></div>
            </div>
            <div className="adminChangePwBlock">
                <div>New password:</div>
                <div><input type="password" ref={newPwRef} /></div>
            </div>
            <div className="adminChangePwButtons">
                <div className="clickable" onClick={closeChangeAdminPwHandler}>Cancel</div>
                <div className="clickable" onClick={saveChangeAdminPwHandler}>Save</div>
            </div>
        </div>
    )
})

export default AdminLogin
