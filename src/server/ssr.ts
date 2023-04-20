import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import SuperJSON from "superjson";
import { prisma } from "./db";
import { getServerAuthSession } from "./auth";
import type { GetServerSidePropsContext } from "next";

export const createSSRHelper = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => createServerSideHelpers({
  router: appRouter,
  ctx: {
    prisma,
    session: await getServerAuthSession(ctx)
  },
  transformer: SuperJSON
});