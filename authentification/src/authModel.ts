type ErrorMessage = string
type LoginInfo = {
    login : string,
    password: string
}
type AllUsers = LoginInfo[]
type UserInfo = string


export {LoginInfo, ErrorMessage, AllUsers, UserInfo}