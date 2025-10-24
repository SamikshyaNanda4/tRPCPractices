"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("./trpc");
const standalone_1 = require("@trpc/server/adapters/standalone");
const zod_1 = require("zod");
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
    })
});
const server = (0, standalone_1.createHTTPServer)({
    router: exports.appRouter
});
server.listen(3000);
//# sourceMappingURL=index.js.map