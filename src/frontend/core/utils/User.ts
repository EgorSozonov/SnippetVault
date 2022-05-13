import { SignInSuccessDTO } from "../types/dto/AuthDTO"
import EitherMsg from "../types/EitherMsg"
import { UserAccount } from "../types/UserAccount"
import { dateOfTS } from "./DateUtils"


export function processSignIn(response: EitherMsg<SignInSuccessDTO[]>, status: "user" | "admin", userName: string): UserAccount | null {
        if (response.isOK === false) {
            console.log(response.errMsg)
            return null
        } else if (response.value.length < 1) {
            console.log("Error: empty response")
            return null
        } else if (response.value[0].userId < 0) {
            console.log("Error: userId < 0")
        }

        const successDTO = response.value[0]
        const expiration = dateOfTS(new Date())
        const result: UserAccount = {
            name: userName, expiration, userId: successDTO.userId, status,
        }
        return result
    }