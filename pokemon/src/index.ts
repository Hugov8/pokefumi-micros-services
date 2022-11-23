import {app} from "./app";
import {AddressInfo} from 'net';

const server = app.listen(5003, '0.0.0.0', () => {
    const {port, address} = server.address() as AddressInfo;
    console.log("Server listenng on:", "http://"+address+":"+port);
})