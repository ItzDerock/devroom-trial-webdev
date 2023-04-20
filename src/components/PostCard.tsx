import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";

type PostCardProps = {
  post: {
    id: string;
    createdAt: Date;
    title: string;
    content: string | null;
    author: {
      name: string;
      profilePicture: string;
    };
  };

  previewMode?: boolean;
  maxContentLength?: number;
};

export default function PostCard(props: PostCardProps) {
  const router = useRouter();

  return (
    <div
      className="flex cursor-pointer flex-col gap-1 rounded-md bg-slate-800 p-4 shadow-lg"
      onClick={() => {
        if (!props.previewMode) {
          void router.push(`/post/${props.post.id}`);
        }
      }}
    >
      {/* Title */}
      <h1 className="truncate overflow-ellipsis text-xl text-white">
        {props.post.title}
      </h1>

      {/* Content */}
      {props.post.content && (
        <ReactMarkdown className="max-w-full break-words text-slate-400">
          {props.post.content.length > (props.maxContentLength ?? 1024)
            ? props.post.content.substring(0, props.maxContentLength ?? 1024) +
              "..."
            : props.post.content}
        </ReactMarkdown>
      )}

      {/* Event host and date*/}
      <div className="flex w-full flex-row">
        {/* left is host */}
        <div className="flex w-1/2 flex-row gap-2 align-middle">
          {props.post.author.profilePicture && (
            <img
              src={props.post.author.profilePicture}
              className="h-8 w-8 rounded-full"
              alt="Profile Picture"
            />
          )}

          <div className="my-auto flex flex-row gap-2 text-white">
            @{props.post.author.name}
          </div>
        </div>

        {/* right is date */}
        <div className="flex w-1/2 flex-row justify-end">
          <span className="my-auto text-slate-500">
            {props.post.createdAt.toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
