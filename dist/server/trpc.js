"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedProcedure = exports.publicProcedure = exports.router = void 0;
const server_1 = require("@trpc/server");
//This initialization should only be done once per backend
const t = server_1.initTRPC.context().create();
exports.router = t.router;
exports.publicProcedure = t.procedure;
// Protected procedure that requires authentication
exports.protectedProcedure = t.procedure.use((opts) => {
    if (!opts.ctx.username) {
        throw new server_1.TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to access this"
        });
    }
    return opts.next({
        ctx: {
            username: opts.ctx.username
        }
    });
});
//# sourceMappingURL=trpc.js.map