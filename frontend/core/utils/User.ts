import { HandshakeResponseDTO, SignInResponseDTO } from "../types/dto/AuthDTO"
import ServerEither from "../types/ServerEither"
import ServerResponse from "../types/ServerResponse"


export function processHandshake(response: ServerResponse<ServerEither<HandshakeResponseDTO>>): ServerResponse<HandshakeResponseDTO> {
    console.dir(response)
    if (response.isOK === false) {
        return response
    }
    if (response.value.isRight === false) {
        return {isOK: false, errMsg: response.value.errMsg}
    }

    return {isOK: true, value: response.value.value}
}

export function processSignIn(response: ServerResponse<ServerEither<SignInResponseDTO>>): ServerResponse<SignInResponseDTO> {
    if (response.isOK === false) {
        return response
    }
    if (response.value.isRight === false) return {isOK: false, errMsg: response.value.errMsg}

    return {isOK: true, value: response.value.value}
}


export function validatePassword(newPw: string): string {
    if (!newPw || newPw.length < 8) {
            return "Password must be at least 8 symbols in length!"
    }
    return ""
}

export function validateChangePassword(newPw1: string, newPw2: string): string {
    const errMsg = validatePassword(newPw1)
    if (errMsg !== "") return errMsg
    if (newPw1 !== newPw2) {
        return "Passwords don't match!"
    }
    return ""
}
