import { HandshakeResponseDTO, SignInResponseDTO } from "../types/dto/AuthDTO"
import EitherMsg from "../types/EitherMsg"
import { UserAccount } from "../types/UserAccount"
import { dateOfTS } from "./DateUtils"


export function processHandshake(response: EitherMsg<HandshakeResponseDTO[]>, status: "user" | "admin"): HandshakeResponseDTO | null {
    if (response.isOK === false) {
        console.log(response.errMsg)
        return null
    } else if (response.value.length < 1) {
        console.log("Error: empty response")
        return null
    }
    return response.value[0]
}

export function processSignIn(response: EitherMsg<SignInResponseDTO[]>, status: "user" | "admin", userName: string): UserAccount | null {
    if (response.isOK === false) {
        console.log(response.errMsg)
        return null
    } else if (response.value.length < 1) {
        console.log("Error: empty response")
        return null
    } else if (response.value[0].M2 < 0) {
        console.log("Error: userId < 0")
    }

    const successDTO = response.value[0]
    const expiration = dateOfTS(new Date())
    const result: UserAccount = {
        name: userName, expiration, userId: successDTO.userId, status,
    }
    return result
}
