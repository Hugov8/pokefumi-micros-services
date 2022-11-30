import * as jwt from "jsonwebtoken";

export const decode = (token: string) : any => {
    return jwt.verify(token, "1234");
}