import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "~/server/db";
import { env } from "~/env.mjs";
import crypto from "crypto";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  // interface User {
  // ...other properties
  // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: ({ token, user }) => ({
      ...token,
      user,
    }),
  },
  secret: env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: {
          label: "Username",
          type: "text",
        },

        password: {
          label: "Password",
          type: "password"
        }
      },

      authorize: async (credentials, _req) => {
        if (!credentials || !credentials.username || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { name: credentials.username },
              { email: credentials.username }
            ]
          },

          select: {
            id: true,
            name: true,
            email: true,
            password: true
          }
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const [, salt, hash] = user.password.split('.') as [string, string, string];

        // rehash
        const newHash = crypto.createHmac("md5", salt).update(credentials.password).digest("hex");

        // compare
        if (newHash !== hash) {
          throw new Error("Invalid credentials");
        }

        // return user
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
    })

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],

  session: {
    strategy: "jwt",
  },

  debug: true
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
