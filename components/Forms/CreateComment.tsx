import { createComment } from "@/actions/comments";
import { getTimeAgo } from "@/lib/utils";
import { CommentType, SafeUser } from "@/types";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const CreateComment = ({
  postId,
  comments,
  user,
}: {
  postId: string;
  comments?: CommentType[];
  user: SafeUser;
}) => {
  const [commentValue, setCommentValue] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [commentValue]);

  const handleComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const commentBody = {
      user: {
        firstname: user.firstname,
        lastname: user.firstname,
        userId: user.userId,
        avatar: user.avatar,
        _id: user._id,
      },
      comment: commentValue,
    };

    setLoading(true);

    const newComment = await createComment(commentBody, postId);

    if (newComment) {
      setCommentValue("");

      toast.success("Comment added", {
        description: "Your comment has been added successfully.",
        className: " !text-green-500",
        duration: 3000,
      });
    } else {
      toast.error("Couldn't add comment", {
        description: "Please try again later.",
        className: " !text-red-500",
        duration: 3000,
      });
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={(e) => handleComment(e)}
      className="flex-1 flex flex-col mt-4"
    >
      <div className="flex items-center gap-2">
        <Link href={user.userId}>
          <Image
            src={user.avatar}
            width={35}
            height={35}
            alt="user avatar"
            className="rounded-full self-start"
          />
        </Link>

        <div
          className={`flex-1 flex flex-col justify-center px-1 border-[2px]  border-gray-400 min-h-9 rounded-2xl outline-0 text-gray-600 ${
            commentValue ? "h-max justify-center pt-1" : ""
          }`}
        >
          <textarea
            ref={textareaRef}
            placeholder="Add a comment..."
            className="w-full outline-none px-2 resize-none overflow-hidden bg-transparent"
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            rows={1}
          />

          {commentValue && (
            <button
              disabled={loading}
              type="submit"
              className="self-end mt-4 mb-2 mr-2 bg-blue-600 px-3 py-[2px] rounded-2xl text-white font-medium cursor-pointer"
            >
              {loading ? "Loading..." : "Comment"}
            </button>
          )}
        </div>
      </div>

      {comments?.length ? (
        <>
          <span className="my-6 text-lg text-gray-500 font-medium">Newest</span>

          <div className="flex-1 flex flex-col gap-6">
            {comments.map((comment) => (
              <div className="flex items-start gap-4" key={comment._id}>
                <Image
                  src={comment.user.avatar}
                  width={35}
                  height={35}
                  alt="user avatar"
                  className="rounded-full self-start"
                />

                <div className=" leading-tight">
                  <h4 className="font-medium">
                    {comment.user.firstname} {comment.user.lastname}
                  </h4>

                  <span className="text-sm text-gray-400">
                    {getTimeAgo(comment.createdAt)}
                  </span>

                  <p className="w-full mt-4">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </form>
  );
};

export default CreateComment;
