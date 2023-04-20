import { z } from "zod";
import * as crypto from "crypto";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import { Prisma } from "@prisma/client";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(z.object({ email: z.string(), password: z.string(), username: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userSalt = crypto.randomBytes(16).toString("hex");

      // hash password
      const password = crypto.createHmac("md5", userSalt).update(input.password).digest("hex");

      // profile picture
      const avatar = createAvatar(lorelei, {
        seed: input.username,
      });

      // create user
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: `v1.${userSalt}.${password}`,
          name: input.username,
          profilePicture: await avatar.toDataUri(),
        },
      }).catch((err) => {
        if ((err instanceof Prisma.PrismaClientKnownRequestError) && err.code === "P2002") {
          throw new Error("Username or email already taken");
        }

        throw err;
      });

      return user;
    }),

  me: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.session.user.email) throw new Error("Not logged in");

      // get user
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.session.user.email,
        },

        select: {
          name: true,
          email: true,
          profilePicture: true
        }
      });

      return user;
    })
});
