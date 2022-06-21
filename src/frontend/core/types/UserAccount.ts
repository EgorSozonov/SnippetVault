import { DateOnly } from "../utils/DateUtils"

export type UserStatus =
    | "guest"
    | "user"
    | "admin"


export type UserAccount = {
    userName: string,
    expiration: DateOnly,
    status: UserStatus,
}
