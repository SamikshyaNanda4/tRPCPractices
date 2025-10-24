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
    let response =await trpc.createTodo.mutate({
    title: "GO to gym",
    description:"Hello YOu have to fulfill the necessary food requirement and go to the gym"
    })
    
    console.log(response)

}

createMyTodo()