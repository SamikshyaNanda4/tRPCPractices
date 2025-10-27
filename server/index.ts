import { publicProcedure, protectedProcedure, router } from "./trpc"
import { createHTTPServer } from "@trpc/server/adapters/standalone"
import { z } from "zod"
import * as jwt from "jsonwebtoken"

const JWT_SECRET = "SamikshyaNanda4"

const users: {
    email: string;
    password: string;
}[] = [];

const todos: {
    id: string;
    title: string;
    description: string;
    createdBy: string;
}[] = [];

const todoInputType = z.object({
    title: z.string(),
    description: z.string()
})

export const appRouter = router({
    // Protected endpoint - requires JWT token
    createTodo: protectedProcedure
        .input(todoInputType)
        .mutation(async (opts) => {
            const username = opts.ctx.username;
            console.log(username, "username is here")
            const { title, description } = opts.input;

            // Create new todo
            const newTodo = {
                id: String(Date.now()), // Simple ID generation
                title,
                description,
                createdBy: username
            };

            // Store in todos array
            todos.push(newTodo);

            return newTodo;
        }),

    // Get all todos - protected endpoint
    getAllTodos: protectedProcedure
        .mutation((opts) => {
            const username = opts.ctx.username;

            // Return only todos created by the logged-in user
            const userTodos = todos.filter(todo => todo.createdBy === username);

            return {
                todos: userTodos,
                count: userTodos.length
            };
        }),

    // Sign up - creates new user and returns JWT token
    signUp: publicProcedure
        .input(z.object({
            email: z.string().email(),
            password: z.string().min(6),
        }))
        .mutation((opts) => {
            const { email, password } = opts.input;

            // Check if user already exists
            for (let i = 0; i < users.length; i++) {
                if (users[i]?.email === email) {
                    throw new Error("User already exists");
                }
            }

            // Add new user
            users.push({ email, password });

            // Generate token
            const token = jwt.sign({ email }, JWT_SECRET);

            return {
                token,
                message: "User created successfully"
            }
        }),

    // Sign in - validates credentials and returns JWT token
    signIn: publicProcedure
        .input(z.object({
            email: z.string().email(),
            password: z.string(),
        }))
        .mutation((opts) => {
            const { email, password } = opts.input;

            // Find user
            const user = users.find(u => u.email === email);

            if (!user || user.password !== password) {
                throw new Error("Invalid email or password");
            }

            // Generate token
            const token = jwt.sign({ email }, JWT_SECRET);

            return {
                token,
                message: "Signed in successfully"
            }
        })
})

const server = createHTTPServer({
    router: appRouter,
    createContext(opts) {
        const authHeader = opts?.req?.headers["authorization"];
        const token = typeof authHeader === "string" ? authHeader : authHeader?.[0];

        if (!token) {
            return {};
        }

        try {
            const verifiedUser = jwt.verify(token, JWT_SECRET);
            console.log(verifiedUser, "verified user is here");

            if (typeof verifiedUser === "object" && verifiedUser !== null && "email" in verifiedUser) {
                return {
                    username: verifiedUser.email as string
                };
            }
            return {};
        } catch (error) {
            console.log("Invalid token");
            return {};
        }
    }
})
server.listen(3000)

export type AppRouter = typeof appRouter;

