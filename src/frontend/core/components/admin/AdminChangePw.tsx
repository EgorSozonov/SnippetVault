import { FunctionComponent, useContext, useRef } from "react"
import React from "react"
import { observer } from "mobx-react-lite"
import { storeContext } from "../../App"
import MainState from "../../mobX/AllState"
import { validateChangePassword } from "../../utils/User"
import { toast } from "react-toastify"


type Props = {
    closeChangeAdminPwHandler: () => void,
}

const AdminLogin: FunctionComponent<Props> = observer(({closeChangeAdminPwHandler,  }: Props) => {
    const state = useContext<MainState>(storeContext)

    const oldPwRef = useRef<HTMLInputElement>(null)
    const newPwRef = useRef<HTMLInputElement>(null)
    const newPwRepeatRef = useRef<HTMLInputElement>(null)

    const saveChangeAdminPwHandler = async () => {
        const mbUserId = state.user.userNameGet()
        if (mbUserId === null || state.user.acc === null) return

        if (!oldPwRef.current || !newPwRef.current || !newPwRepeatRef.current) return
        const oldPw: string = oldPwRef.current.value
        const newPw: string = newPwRef.current.value
        const newPwRepeat: string = newPwRepeatRef.current.value

        const errMsg = validateChangePassword(newPw, newPwRepeat)

        if (errMsg !== "") {
            toast.error(errMsg , { autoClose: 4000 })
            return
        }
        await state.user.changePw(oldPw, newPw, "admin")
        closeChangeAdminPwHandler()
    }

    return (
        <div className="adminChangePw">
            <div className="adminChangePwBlock">
                <div>Old password 1:</div>
                <div><input type="password" ref={oldPwRef} /></div>
            </div>
            <div className="adminChangePwBlock">
                <div>New password:</div>
                <div><input type="password" ref={newPwRef} /></div>
                <div>New password repeat:</div>
                <div><input type="password" ref={newPwRepeatRef} /></div>
            </div>
            <div className="adminChangePwButtons">
                <div className="clickable" onClick={closeChangeAdminPwHandler}>Cancel</div>
                <div className="clickable" onClick={saveChangeAdminPwHandler}>Save</div>
            </div>
        </div>
    )
})

export default AdminLogin
