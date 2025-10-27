import { initTRPC, TRPCError } from '@trpc/server'

//This initialization should only be done once per backend
const t = initTRPC.context<{ username?: string }>().create()

export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use((opts) => {
    if (!opts.ctx.username) {
        throw new TRPCError({
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

