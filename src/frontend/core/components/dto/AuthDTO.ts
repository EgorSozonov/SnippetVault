export type SignInSuccessDTO = {
    userId: number,
    accessToken: string,
}

export type SignInDTO = {
    userName: string,
    password: string,
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