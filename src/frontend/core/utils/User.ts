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

export function processSignIn(response: EitherMsg<SignInResponseDTO[]>, status: "user" | "admin", userName: string): SignInResponseDTO | null {
    if (response.isOK === false) {
        console.log(response.errMsg)
        return null
    } else if (response.value.length < 1) {
        console.log("Error: empty response")
        return null
    }

    return response.value[0]
}
