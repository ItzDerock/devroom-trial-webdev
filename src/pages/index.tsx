import type { GetServerSideProps, NextPage } from "next";
import { Button } from "~/components/Button";
import PostCard from "~/components/PostCard";
import Navbar from "~/partials/Navbar";
import { createSSRHelper } from "~/server/ssr";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const posts = api.posts.allPosts.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (data) => data.cursor,
    }
  );

  const numLoaded = posts.data?.pages.reduce((acc, page) => {
    return acc + page.data.length;
  }, 0);

  return (
    <main className="h-full w-full">
      <Navbar />

      <div className="mx-auto flex max-w-3xl flex-col gap-8 pt-8">
        {!posts.isLoading && numLoaded === 0 && (
          <div className="text-center text-gray-500">No posts found</div>
        )}

        {posts.data?.pages.map((page) =>
          page.data.map((post) => <PostCard post={post} key={post.id} />)
        )}

        {posts.isFetchingNextPage && (
          <div className="text-center text-gray-500">Loading...</div>
        )}

        {posts.data &&
          posts.data.pages[posts.data.pages.length - 1]?.hasMore && (
            <Button
              className="mx-auto text-center"
              onClick={() => {
                void posts.fetchNextPage();
              }}
            >
              Load More
            </Button>
          )}
      </div>
    </main>
  );
};

export default Home;

// SSR
export const getServerSideProps: GetServerSideProps = async (context) => {
  const helpers = await createSSRHelper(context);

  // prefetch the first few posts
  await helpers.posts.allPosts.prefetchInfinite({
    limit: 10,
  });

  // return the dehydrated state
  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};
