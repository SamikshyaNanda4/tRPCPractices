import { publicProcedure, router } from "./trpc"
import { createHTTPServer } from "@trpc/server/adapters/standalone"
import { z } from "zod"

const todoInputType = z.object({
    title: z.string(),
    description: z.string()
})

export const appRouter = router({
    createTodo: publicProcedure
        .input(todoInputType)
        .mutation(async (opts) => {
            //everytime the clinet does a call you will see below hi there
            console.log("Hi there")
            const { title, description } = opts.input;
            //Do db stuff here itself
            return {
                id: "1",
                title,
                description
            }

        })
})

const server = createHTTPServer({
    router: appRouter
})
server.listen(3000)

export type AppRouter = typeof appRouter;

