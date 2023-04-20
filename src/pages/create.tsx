import type { GetServerSidePropsContext, NextPage } from "next";
import Navbar from "~/partials/Navbar";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { useRouter } from "next/router";
import PostCard from "~/components/PostCard";
import { useForm } from "@mantine/form";

const CreatePost: NextPage = () => {
  const router = useRouter();
  const me = api.auth.me.useQuery();
  const create = api.posts.create.useMutation({
    onSuccess: (data) => {
      void router.push(`/post/${data}`);
    },
  });

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
    },

    validate: {
      title: (value) => (value.length === 0 ? "Title is required" : null),
    },
  });

  return (
    <main className="h-full w-full">
      <Navbar />

      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-24 pt-8">
        <Input
          label={`Title (${form.values.title.length}/64)`}
          placeholder="Title"
          required
          maxLength={64}
          {...form.getInputProps("title")}
          error={form.errors.title}
        />

        <div>
          <label className="text-sm text-white">Description</label>
          <textarea
            className="w-full rounded-md bg-white/10 p-4 text-white"
            placeholder="Description (supports **markdown**)"
            {...form.getInputProps("description")}
          />
        </div>

        <div>
          <label className="text-sm text-white">Preview</label>
          <PostCard
            previewMode
            maxContentLength={Infinity}
            post={{
              id: "#",
              title: form.values.title,
              content: form.values.description,
              createdAt: new Date(),
              author: {
                name: me.data?.name ?? "Loading...",
                profilePicture: me.data?.profilePicture ?? "",
              },
            }}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white/10 p-4">
        <div className="mx-auto flex max-w-3xl flex-row">
          <Button
            onClick={() => {
              if (form.validate().hasErrors) return;

              create.mutate({
                title: form.values.title,
                content: form.values.description,
              });
            }}
            className="mx-auto"
            loading={create.isLoading}
          >
            {create.isLoading ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default CreatePost;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },

      props: {},
    };
  }

  return {
    props: {},
  };
};
