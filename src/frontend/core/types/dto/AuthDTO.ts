export type SignInSuccessDTO = {
    userId: number,
    accessToken: string,
}

export type SignInDTO = {
    userName: number,
    password: string,
}

export type SignInAdminDTO = {
    userName: number,
    password1: string,
    password2: string,
}
