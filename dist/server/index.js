"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("./trpc");
const standalone_1 = require("@trpc/server/adapters/standalone");
const zod_1 = require("zod");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "SamikshyaNanda4";
const users = [];
const todos = [];
const todoInputType = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string()
});
exports.appRouter = (0, trpc_1.router)({
    // Protected endpoint - requires JWT token
    createTodo: trpc_1.protectedProcedure
        .input(todoInputType)
        .mutation(async (opts) => {
        const username = opts.ctx.username;
        console.log(username, "username is here");
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
    getAllTodos: trpc_1.protectedProcedure
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
    signUp: trpc_1.publicProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
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
        };
    }),
    // Sign in - validates credentials and returns JWT token
    signIn: trpc_1.publicProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
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
        };
    })
});
const server = (0, standalone_1.createHTTPServer)({
    router: exports.appRouter,
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
                    username: verifiedUser.email
                };
            }
            return {};
        }
        catch (error) {
            console.log("Invalid token");
            return {};
        }
    }
});
server.listen(3000);
//# sourceMappingURL=index.js.map