// deprecated
export type SignInSuccessDTO = {
    userId: number,
}

export type RegisterDTO = {
    userName: string;
    salt: string;
    verifier: string;
}

export type HandshakeDTO = {
    userName: string;
}

export type HandshakeResponseDTO = {
    salt: string;
    B: string;
}

export type SignInDTO = {
    userName: string,
    A: string,
    M1: string,
}

export type SignInResponseDTO = {
    M2: string;
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
