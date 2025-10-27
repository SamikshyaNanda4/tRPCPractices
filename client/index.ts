import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server";

const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url:"http://localhost:3000"
        })
    ]
})

async function createMyTodo() {
    let response =await trpc.signUp.mutate({
    email: "samikshya.nanda.4848@gmail.com",
    password:"HelloWorld"
    })
    
    console.log(response)

}

createMyTodo()