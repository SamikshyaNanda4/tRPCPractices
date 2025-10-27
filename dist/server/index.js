"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("./trpc");
const standalone_1 = require("@trpc/server/adapters/standalone");
const zod_1 = require("zod");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "SamikshyaNanda4";
const users = [];
const todoInputType = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string()
});
exports.appRouter = (0, trpc_1.router)({
    createTodo: trpc_1.publicProcedure
        .input(todoInputType)
        .mutation(async (opts) => {
        //everytime the clinet does a call you will see below hi there
        console.log("Hi there");
        const { title, description } = opts.input;
        //Do db stuff here itself
        return {
            id: "1",
            title,
            description
        };
    }),
    signUp: trpc_1.publicProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string(),
        password: zod_1.z.string(),
    }))
        .mutation((opts) => {
        let email = opts.input.email;
        let password = opts.input.password;
        // Check if user already exists
        for (let i = 0; i < users.length; i++) {
            if (users[i]?.email === email) {
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
        };
    })
});
const server = (0, standalone_1.createHTTPServer)({
    router: exports.appRouter
});
server.listen(3000);
//# sourceMappingURL=index.js.map