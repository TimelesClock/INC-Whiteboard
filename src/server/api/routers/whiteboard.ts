import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { type JsonObject } from "@tldraw/tldraw";




export const whiteboardRouter = createTRPCRouter({


  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      const whiteboard = await ctx.db.whiteboard.create({
        data: {
          name: input.name,
        },
      });
      //create whiteboarduser
      await ctx.db.whiteboardUsers.create({
        data: {
          whiteboardId: whiteboard.id,
          userId: ctx.session.user.id,
          owner: true,
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

  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      //find all whiteboards under the current user
      const whiteboards = await ctx.db.whiteboardUsers.findMany({
        where: { userId: ctx.session.user.id },
      });
      return whiteboards;
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
