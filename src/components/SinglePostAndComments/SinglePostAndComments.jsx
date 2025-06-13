import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../contexts/userIdContext";
const SinglePostAndComments = ({
  singlePostInfos,
  setSinglePostObject,
  setRenderSinglePostPage,
  refreshPosts,
}) => {
  const [showComments, setShowComments] = useState(true);
  const [commentValueTxt, setCommentValueTxt] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const { userId } = useContext(UserContext);
  const addComment = async (e, postId) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/posts/${postId}/comments`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: commentValueTxt }),
        }
      );

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const newComment = await res.json();
      console.log("New comment added:", newComment);
      
      setCommentValueTxt("");

      setSinglePostObject((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }));
      refreshPosts();

    
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/posts/comments/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      setSinglePostObject((prev) => ({
        ...prev,
        comments: prev.comments.filter((comment) => comment.id !== commentId),
      }));
      refreshPosts();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const saveEditedComment = async (commentId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/posts/comments/${commentId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: editedContent }),
        }
      );

      if (!res.ok) throw new Error("Failed to update comment");

      setSinglePostObject((prev) => ({
        ...prev,
        comments: prev.comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: editedContent }
            : comment
        ),
      }));

      setEditCommentId(null);
      setEditedContent("");
      refreshPosts();
    } catch (error) {
      console.error("Failed to save comment:", error);
    }
  };

  return (
    <section className="h-full fixed inset-0 z-10 bg-[#0f0f1c]/90 flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-2xl p-6 bg-primary rounded-2xl shadow-[0_8px_30px_rgba(255,255,255,0.2)]">
        <button
          onClick={() => setRenderSinglePostPage(false)}
          className="absolute top-4 right-4 text-accent hover:text-white transition"
        >
          ✕
        </button>

        <article className="mb-8">
          <h1 className="text-accent text-3xl font-vt323 mb-2">
            {singlePostInfos.title}
          </h1>
          <p className="text-white text-sm mb-1">
            Posted in{" "}
            <span className="text-accent">#{singlePostInfos.community}</span>
          </p>
          <p className="text-white mt-4 leading-relaxed">
            {singlePostInfos.body}
          </p>
        </article>

        <div
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-2 mb-4 cursor-pointer text-accent hover:text-white transition"
        >
          <span className="text-white">Here are the comments</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transform transition-transform duration-300 ${
              showComments ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.353a.75.75 0 011.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {showComments && (
          <section className="border-t border-accent pt-6">
            <form
              onSubmit={(e) => addComment(e, singlePostInfos.id)}
              className="mb-6"
            >
              <textarea
                className="w-full p-4 rounded-md bg-[#1e1e2f] text-white border border-accent placeholder:text-accent focus:outline-none resize-none mb-2"
                placeholder="Write your comment..."
                rows={4}
                onChange={(e) => setCommentValueTxt(e.target.value)}
                value={commentValueTxt}
              />
              <button
                type="submit"
                className="bg-primary rounded-2xl px-5 py-2 text-sm font-medium text-white shadow-[0_0px_12px_rgba(171,239,254,0.4)] hover:shadow-[0_0px_12px_rgba(171,239,254,0.6)]"
              >
                Submit Comment
              </button>
            </form>

            {singlePostInfos.comments.length > 0 ? (
              <div className="space-y-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                {singlePostInfos.comments.map((comment, index) => {
                  const isEditing = editCommentId === comment.id;
                  const formattedDate = new Date(
                    comment.created_at
                  ).toLocaleString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  });

                  return (
                    <div
                      key={index}
                      className="bg-[#30303d] p-4 rounded-lg border border-accent shadow-sm relative"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-accent font-semibold text-sm">
                          {comment.commenter || `User #${comment.user_id}`}
                        </p>
                        <span className="text-xs text-gray-400 italic">
                          {formattedDate}
                        </span>
                      </div>

                      {isEditing ? (
                        <textarea
                          className="w-full p-2 mt-2 bg-[#1e1e2f] text-white border border-accent rounded-md resize-none"
                          rows={2}
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                        />
                      ) : (
                        <p className="text-white text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      )}
                      {Number(userId) === comment.user_id && (
                        <div className="mt-2 flex gap-3">
                          {isEditing ? (
                            <>
                              <button
                                className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                                onClick={() => saveEditedComment(comment.id)}
                              >
                                Save
                              </button>
                              <button
                                className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-400 transition"
                                onClick={() => setEditCommentId(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              className="text-xs px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-500 transition"
                              onClick={() => {
                                setEditCommentId(comment.id);
                                setEditedContent(comment.content);
                              }}
                            >
                              Edit
                            </button>
                          )}

                          <button
                            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition"
                            onClick={() => deleteComment(comment.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-white italic">
                There are no comments yet. Be the first to contribute!
              </p>
            )}
          </section>
        )}
      </div>
    </section>
  );
};

export default SinglePostAndComments;
