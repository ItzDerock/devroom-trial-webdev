import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import PostCard from "~/components/PostCard";
import Navbar from "~/partials/Navbar";
import { createSSRHelper } from "~/server/ssr";
import { api } from "~/utils/api";

const Post: NextPage = () => {
  const router = useRouter();
  const postData = api.posts.byId.useQuery({
    id: router.query.post as string,
  });
  const relatedPosts = api.posts.relatedPosts.useQuery({
    id: router.query.post as string,
  });

  return (
    <main className="h-full w-full">
      <Navbar />

      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-24 pt-8">
        <div>
          {/* poster */}
          <div className="flex items-center gap-2">
            <img
              className="h-8 w-8 rounded-full"
              src={postData.data?.author.profilePicture ?? ""}
              alt="avatar"
            />

            <p className="text-white">@{postData.data?.author.name}</p>
          </div>

          {/* title */}
          <h1 className="break-words text-4xl font-bold text-white">
            {postData.data?.title}
          </h1>
        </div>

        <ReactMarkdown className="break-all">
          {postData.data?.content ?? ""}
        </ReactMarkdown>

        {/* post date */}
        <div className="text-sm text-gray-600">
          Posted on {new Date(postData.data?.createdAt ?? 0).toLocaleString()}
        </div>

        {/* dividing line */}
        <div className="h-px bg-white/10" />

        {/* related posts */}
        <h2 className="text-2xl font-bold text-white">Related Posts</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {relatedPosts.data?.map((post, i) => (
            <PostCard
              key={`${post.id}-${i}`}
              post={post}
              maxContentLength={128}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Post;

// SSR
export const getServerSideProps: GetServerSideProps = async (context) => {
  const helpers = await createSSRHelper(context);

  // get the id
  const id = context.params?.post;

  // validate the id
  if (typeof id !== "string") {
    return {
      notFound: true,
    };
  }

  // fetch the post
  const post = await helpers.posts.exists.fetch({ id });

  // validate the post
  if (!post) {
    return {
      notFound: true,
    };
  }

  // prefetch the data
  await helpers.posts.byId.prefetch({ id });

  // return the dehydrated state
  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};
