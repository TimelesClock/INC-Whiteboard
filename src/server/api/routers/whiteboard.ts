import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { type JsonObject } from "@tldraw/tldraw";




export const whiteboardRouter = createTRPCRouter({


  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      return await ctx.db.whiteboard.create({
        data: {
          name: input.name,
        },
      });
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.whiteboard.findUnique({
        where: { id: input.id },
      });
    }),

  getAll: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.whiteboard.findMany();
    }),

  update: publicProcedure
    .input(z.object({ id: z.string(), content: z.unknown() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.whiteboard.update({
        where: { id: input.id },
        data: {
          content: input.content as JsonObject
        },
      });
    }),

});
