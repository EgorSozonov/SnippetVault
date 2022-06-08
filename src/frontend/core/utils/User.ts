import { HandshakeResponseDTO, SignInResponseDTO } from "../types/dto/AuthDTO"
import ServerEither from "../types/ServerEither"
import ServerResponse from "../types/ServerResponse"
import { UserAccount } from "../types/UserAccount"
import { dateOfTS } from "./DateUtils"


export function processHandshake(response: ServerResponse<ServerEither<HandshakeResponseDTO>>, status: "user" | "admin"): ServerResponse<HandshakeResponseDTO> {
    if (response.isOK === false) {
        return response
    }
    if (response.value.isRight === false) {
        return {isOK: false, errMsg: response.value.errMsg}
    }

    return {isOK: true, value: response.value.value}
}

export function processSignIn(response: ServerResponse<ServerEither<SignInResponseDTO>>, status: "user" | "admin"): ServerResponse<SignInResponseDTO> {
    if (response.isOK === false) {
        return response
    }
    if (response.value.isRight === false) {
        return {isOK: false, errMsg: response.value.errMsg}
    }

    return {isOK: true, value: response.value.value}
}
