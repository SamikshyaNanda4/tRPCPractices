import { publicProcedure, router } from "./trpc"
import { createHTTPServer } from "@trpc/server/adapters/standalone"
import { z } from "zod"
import * as jwt from "jsonwebtoken"

const JWT_SECRET = "SamikshyaNanda4"

const users: {
    email: string;
    password: string;
}[] = [];

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
        }),
    signUp: publicProcedure
        .input(z.object({
            email: z.string(),
            password: z.string(),
        }))
        .mutation((opts) => {
            let email = opts.input.email;
            let password = opts.input.password;
            // Check if user already exists
            for (let i = 0; i < users.length; i++){
                if(users[i]?.email === email) {
                    throw new Error("User already exists");
                }
            }

            // Add new user
            users.push({ email, password });

            // Generate token
            const token = jwt.sign({
                email
            }, JWT_SECRET);

            return {
                token,
                success: true
            }

        })
})

const server = createHTTPServer({
    router: appRouter
})
server.listen(3000)

export type AppRouter = typeof appRouter;

