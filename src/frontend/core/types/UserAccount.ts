import { DateOnly } from "../utils/DateUtils"

export type UserStatus =
    | "guest"
    | "user"
    | "admin"


export type UserAccount = {
    name: string,
    userId: number,
    accessToken: string,
    expiration: DateOnly,
    status: UserStatus,
}
