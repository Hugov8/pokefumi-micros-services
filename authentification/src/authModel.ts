type ErrorMessage = string
type LoginInfo = {
    username : string,
    password: string
}
type AllUsers = LoginInfo[]
type UserInfo = string

export {LoginInfo, ErrorMessage, AllUsers, UserInfo}