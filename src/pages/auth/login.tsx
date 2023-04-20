import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  type NextPage,
} from "next";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { AuthLayout } from "~/layouts/AuthLayout";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { getServerAuthSession } from "~/server/auth";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/router";

const SignUp: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const [error, setError] = useState<string | null>(null);
  const queryParams = useSearchParams();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      username: (value) => {
        if (value.length < 0) {
          return "Username is required";
        }

        if (value.length < 3) {
          return "Username must be at least 3 characters long";
        }

        return null;
      },
      password: (value) => (value.length < 0 ? "Password is required" : null),
    },
  });

  return (
    <AuthLayout>
      <h1>Create Account</h1>

      {queryParams.get("signupSuccess") && (
        <div className="rounded-md bg-green-500 p-2">
          Account created successfully! Please log in.
        </div>
      )}

      {error && (
        <div className="w-full rounded-md bg-red-500 p-2 text-center text-white">
          {error}
        </div>
      )}

      <form
        onSubmit={form.onSubmit((data) => {
          signIn("credentials", {
            username: data.username,
            password: data.password,
            redirect: false,
          }).then((res) => {
            console.log(res);
            if (!res?.ok) {
              let error = res?.error;

              if (error === "CredentialsSignin") error = "Invalid credentials";

              setError(error ?? "Invalid credentials");
            } else {
              router.push("/");
            }
          });
        })}
        className="flex w-80 flex-col gap-2"
      >
        <Input
          type="text"
          placeholder="Username or email"
          {...form.getInputProps("username")}
          error={form.errors.username}
        />
        <Input
          type="password"
          placeholder="Password"
          {...form.getInputProps("password")}
          error={form.errors.password}
        />
        <Button className="w-full" type="submit">
          Log In
        </Button>
      </form>

      <div className="mt-2 flex w-full flex-col justify-center gap-1 text-center align-middle">
        <Link href="/auth/signup" className="text-blue-300">
          Sign up instead
        </Link>
        <Link href="/" className="text-blue-300">
          Go Home
        </Link>
      </div>
    </AuthLayout>
  );
};

export default SignUp;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },

      props: {},
    };
  }

  return {
    props: {},
  };
};
