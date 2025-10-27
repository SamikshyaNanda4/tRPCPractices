"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@trpc/client");
const trpc = (0, client_1.createTRPCProxyClient)({
    links: [
        (0, client_1.httpBatchLink)({
            url: "http://localhost:3000"
        })
    ]
});
async function createMyTodo() {
    let response = await trpc.signUp.mutate({
        email: "samikshya.nanda.4848@gmail.com",
        password: "HelloWorld"
    });
    console.log(response);
}
createMyTodo();
//# sourceMappingURL=index.js.map