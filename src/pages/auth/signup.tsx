import { GetServerSidePropsContext, type NextPage } from "next";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { AuthLayout } from "~/layouts/AuthLayout";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { redirect } from "next/navigation";
import { api } from "~/utils/api";
import { getServerAuthSession } from "~/server/auth";
import { useState } from "react";
import { useRouter } from "next/router";

const SignUp: NextPage = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signup = api.auth.signup.useMutation({
    onSuccess: (data) => {
      router.push("/auth/login?signupSuccess=true");
    },

    onError: (error) => {
      setError(error.message);
    },
  });

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
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

        // must be alphanumeric and can contain underscores
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          return "Username can only contain letters, numbers and underscores";
        }

        return null;
      },
      email: (value) => (value.length < 0 ? "Email is required" : null),
      password: (value) => (value.length < 0 ? "Password is required" : null),
    },
  });

  return (
    <AuthLayout>
      <h1>Create Account</h1>

      {error && (
        <div className="w-full rounded-md bg-red-500 p-2 text-center text-white">
          {error}
        </div>
      )}

      <form
        // onSubmit={(data) => console.log(data)}
        onSubmit={form.onSubmit((data) => {
          signup.mutate(data);
        })}
        className="flex w-80 flex-col gap-2"
      >
        <Input
          type="text"
          placeholder="Username"
          {...form.getInputProps("username")}
          disabled={signup.isLoading}
          error={form.errors.username}
        />
        <Input
          type="email"
          placeholder="Email"
          {...form.getInputProps("email")}
          disabled={signup.isLoading}
          error={form.errors.email}
        />
        <Input
          type="password"
          placeholder="Password"
          {...form.getInputProps("password")}
          disabled={signup.isLoading}
          error={form.errors.password}
        />
        <Button className="w-full" type="submit" loading={signup.isLoading}>
          {signup.isLoading ? "Loading..." : "Sign Up"}
        </Button>
      </form>

      <div className="mt-2 flex w-full flex-col justify-center gap-1 text-center align-middle">
        <Link href="/auth/login" className="text-blue-300">
          Log in instead
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
