"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const server = app_1.app.listen(5002, '0.0.0.0', () => {
    const { port, address } = server.address();
    console.log("Server listenng on:", "http://" + address + ":" + port);
});
