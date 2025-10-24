import { initTRPC } from '@trpc/server'

    //This initialization should only be done once per backend
    const t= initTRPC.create()

export const router = t.router;
export const publicProcedure = t.procedure;

