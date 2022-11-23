import * as jwt from "jsonwebtoken";

export const decode = (token: string) : any => {
    jwt.verify(token, "secret");
}