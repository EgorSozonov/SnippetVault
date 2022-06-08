import { HandshakeResponseDTO, SignInResponseDTO } from "../types/dto/AuthDTO"
import ServerResponse from "../types/ServerResponse"
import { UserAccount } from "../types/UserAccount"
import { dateOfTS } from "./DateUtils"


export function processHandshake(response: ServerResponse<HandshakeResponseDTO>, status: "user" | "admin"): HandshakeResponseDTO | null {
    if (response.isOK === false) {
        console.log(response.errMsg)
        return null
    } else if (!response.value ) {
        console.log("Error: empty response")
        return null
    }
    console.log("response:")
    console.log(response)

    return response.value
}

export function processSignIn(response: ServerResponse<SignInResponseDTO>, status: "user" | "admin", userName: string): SignInResponseDTO | null {
    if (response.isOK === false) {
        console.log(response.errMsg)
        return null
    } else if (!response.value) {
        console.log("Error: empty response")
        return null
    }

    return response.value
}
