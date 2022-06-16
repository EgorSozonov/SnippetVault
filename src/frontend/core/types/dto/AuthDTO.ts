


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
    M2B64: string;
    userId: number;
}

export type ChangePwDTO = {
    signIn: SignInDTO
    newPw: string
}

export type SignInAdminDTO = {
    userName: string,
    password1: string,
    password2: string,
}

export type ChangePwAdminDTO = {
    signIn: SignInAdminDTO,
    newPw: string,
}
