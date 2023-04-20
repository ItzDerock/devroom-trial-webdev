import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user || !ctx.session.user.email) throw new Error("Not authenticated");

      return (await ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          author: {
            connect: {
              email: ctx.session.user.email
            }
          }
        }
      })).id;
    }),

  allPosts: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().optional()
    }))
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const cursor = input.cursor;

      const data = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc"
        },
        include: {
          author: {
            select: {
              name: true,
              profilePicture: true
            }
          }
        }
      });

      return {
        data: data.slice(0, limit),
        hasMore: data.length === limit + 1,
        cursor: data[data.length - 1]?.id,
      };
    }),

  byId: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.post.findUnique({
        where: {
          id: input.id
        },
        include: {
          author: {
            select: {
              name: true,
              profilePicture: true
            }
          }
        }
      });
    }),

  exists: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      return (await ctx.prisma.post.count({
        where: {
          id: input.id
        }
      })) > 0;
    }),

  relatedPosts: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      // fetch this post
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id
        },
        include: {
          author: true
        }
      });

      if (!post) throw new Error("Post not found");

      // check for posts by the same author
      const authorPosts = await ctx.prisma.post.findMany({
        take: 3,
        orderBy: {
          createdAt: "desc"
        },
        where: {
          authorId: post.authorId,
        },
        include: {
          author: {
            select: {
              name: true,
              profilePicture: true
            }
          }
        }
      });

      // if there are enough posts by the same author, return them
      if (authorPosts.length >= 3) return authorPosts;

      // otherwise, fetch posts by other authors
      const otherPosts = await ctx.prisma.post.findMany({
        take: 3 - authorPosts.length,
        orderBy: {
          createdAt: "desc"
        },
        where: {
          authorId: {
            not: post.authorId
          }
        },
        include: {
          author: {
            select: {
              name: true,
              profilePicture: true
            }
          }
        }
      });

      // return the posts by the same author and other authors
      return [...authorPosts, ...otherPosts];
    })
});
