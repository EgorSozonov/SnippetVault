


export type RegisterDTO = {
    userName: string;
    saltB64: string;
    verifierB64: string;
}

export type HandshakeDTO = {
    userName: string;
}

export type HandshakeResponseDTO = {
    saltB64: string,
    BB64: string,
}

export type SignInDTO = {
    userName: string,
    AB64: string,
    M1B64: string,
}

export type SignInResponseDTO = {
    M2B64: string,
}

export type ChangePwDTO = {
    register: RegisterDTO,
    AB64: string,
    M1B64: string,
    newPw: string,
}
