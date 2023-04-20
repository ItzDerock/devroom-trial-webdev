# My [DevRoom](https://discord.gg/JzSYQ4S48H) Trial Project
(btw if u purchase from devroom, use `BNlGfUAx7M` as your referral code thx)  

> Your project is to create a web application in which users can log in or signup using their email (SSO not required); users must have an active session after closing the tab so that if they open it again, they will be logged in already (You can use packages like PassportJS). There should be functionality from which users can post/create a statement through `/create` or `/post` route. The posts should be visible on the /feed page, and the user should be able to open a single post on a new page.  
> The page with posts should display all the other posts in the footer as cards under the read another post section. You must store all the statements and user data on a Database of your choice (except SQLite).
> You must upload the code on GitHub and prove it belongs to you.  
> You have seven days to complete this project. Themes, palettes, languages, and everything else are up to you.  
> You have 7 days.

## Deployment
1. Clone this repository 
2. Run `pnpm install` to install the dependencies
3. Copy `.env.example` to `.env`
4. Spin up a `PostgreSQL` server and set the `DATABASE_URL` env variable.
5. Run `openssl rand -base64 32` and set `NEXTAUTH_SECRET` env variable to the output. This is used for signing the JWTs.
6. Update `NEXTAUTH_URL` if using this in production
7. Run `pnpm dev` to start the development server. Or, run `pnpm build` and `pnpm start` to start the production server

## Information
- Based on the [T3 Stack](https://create.t3.gg/)
    - Next.js as the framework
    - TypeScript as the language
    - TailwindCSS as the CSS framework
    - Prisma as the ORM
    - tRPC as the API framework for end-to-end type safety
    - NextAuth.js for authentication
        - (modified to use local authenticaion)

## Disclaimer
Obviously, this should not be used in production as there is no rate-limiting on any actions.
Passwords are hashed though with a per-user salt, but other than that, nothing else is encrypted in the database. 
Site should be XSS free since `dangerouslySetInnerHTML` is not used anywhere.