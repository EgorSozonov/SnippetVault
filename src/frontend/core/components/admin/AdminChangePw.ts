import { FunctionComponent, useContext, useEffect, useRef } from "react"
import { html } from "htm/react"
import { observer } from "mobx-react-lite"
import { StoreContext } from "../../App"
import MainState from "../../mobX/MainState"
import { ChangePwAdminDTO, SignInAdminDTO } from "../../types/dto/AuthDTO"

type Props = {
    closeChangeAdminPwHandler: () => void,
}
const AdminLogin: FunctionComponent<Props> = observer(({closeChangeAdminPwHandler,  }: Props) => {
    const state = useContext<MainState>(StoreContext)

    const oldPw1Ref = useRef<HTMLInputElement>(null)
    const oldPw2Ref = useRef<HTMLInputElement>(null)
    const newPwRef = useRef<HTMLInputElement>(null)

    const saveChangeAdminPwHandler = async () => {
        const headers = state.user.headersGet()
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

    return html`
        <div class="adminChangePw">
            <div class="adminChangePwBlock">
                <div>Old password 1:</div>
                <div><input type="password" ref=${oldPw1Ref} /></div>
                <div>Old password 2:</div>
                <div><input type="password" ref=${oldPw2Ref} /></div>
            </div>
            <div class="adminChangePwBlock">
                <div>New password:</div>
                <div><input type="password" ref=${newPwRef} /></div>
            </div>
            <div class="adminChangePwButtons">
                <div class="clickable" onClick=${closeChangeAdminPwHandler}>Cancel</div>
                <div class="clickable" onClick=${saveChangeAdminPwHandler}>Save</div>
            </div>
        </div>
    `
})

export default AdminLogin
