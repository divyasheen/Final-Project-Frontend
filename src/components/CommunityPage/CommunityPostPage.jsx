import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import userImage from "../../assets/images/userImage.jpeg";
import { UserContext } from "../../contexts/userIdContext";

const CommunityPostPage = () => {
  const { community } = useParams();

  const communities = [
    { id: 1, name: "Rules" },
    { id: 2, name: "Hello-world" },
    { id: 3, name: "HTML" },
    { id: 4, name: "Css" },
    { id: 5, name: "JavaScript" },
    { id: 6, name: "Off-Topic" },
    { id: 7, name: "General-Discussions" },
  ];

  const selectedCommunity = communities.find((c) => c.name === community);
  const communityId = selectedCommunity?.id;

  const [communityPosts, setCommunityPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [visibleComments, setVisibleComments] = useState(false);
  const [commentValueTxt, setCommentValueTxt] = useState({});
  // const [editCommentId, setEditCommentId] = useState(null);
  // const [editedContent, setEditedContent] = useState("");
  const { userId } = useContext(UserContext);

  const LIMIT = 10;

  const fetchCommunityPosts = async () => {
    if (!communityId || loading) return;

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/posts/communities/${communityId}?limit=${LIMIT}&offset=${offset}`
      );

      if (!res.ok) {
        console.error("Failed to fetch community posts");
        return;
      }

      const data = await res.json();
      if (data.length < LIMIT) {
        setHasMore(false);
      }

      setCommunityPosts((prev) => {
        const existingPostIds = new Set(prev.map((post) => post.id));
        const newPosts = data.filter((post) => !existingPostIds.has(post.id));
        return [...prev, ...newPosts];
      });

      setOffset((prev) => prev + LIMIT);
    } catch (error) {
      console.error("Error fetching community posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (postId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/posts/${postId}/comments`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: commentValueTxt[postId] }),
        }
      );

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const newComment = await res.json();

      setCommentValueTxt((prev) => ({ ...prev, [postId]: "" }));

      setCommunityPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), newComment],
              }
            : post
        )
      );
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

      setCommunityPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.comments?.some((comment) => comment.id === commentId)) {
            return {
              ...post,
              comments: post.comments.filter(
                (comment) => comment.id !== commentId
              ),
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  useEffect(() => {
    setCommunityPosts([]);
    setOffset(0);
    setHasMore(true);
  }, [communityId]);

  useEffect(() => {
    if (communityId !== undefined && offset === 0) {
      fetchCommunityPosts();
    }
  }, [communityId]);

  const showComments = (postId) => {
    setVisibleComments((prevId) => (prevId === postId ? null : postId));
  };
  return (
    <main className="p-5 bg-background min-h-screen text-white">
      <section className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-accent font-vt323 text-3xl mb-4">
          Posts in {community}
        </h1>

        {communityPosts.length === 0 ? (
          <>
            <p>No posts found for this community.</p>
          </>
        ) : (
          communityPosts.map((post) => (
            <div
              key={post.id}
              className="border border-gray-700 p-4 rounded-md bg-footer hover:bg-accent/20 transition duration-150 space-y-4"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={userImage}
                  alt="User"
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div>
                  <h2 className="font-bold">{post.title}</h2>
                  <p className="text-sm text-gray-300">{post.author}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-200">{post.body}</p>

              {post.comments?.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => showComments(post.id)}
                    className="text-accent underline text-sm hover:text-white transition"
                  >
                    {visibleComments === post.id
                      ? "Hide Comments"
                      : "Show Comments"}{" "}
                    ({post.comments.length})
                  </button>

                  {visibleComments === post.id && (
                    <div className="mt-3 border-t border-gray-600 pt-3 space-y-2">
                      {post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="text-sm border border-gray-700 p-2 rounded-md bg-background"
                        >
                          <p className="text-gray-300">{comment.content}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            by {comment.commenter ?? "Anonymous"} on{" "}
                            {new Date(comment.created_at).toLocaleDateString()}
                          </div>

                          {Number(userId) === comment.user_id && (
                            <div className="mt-2 flex gap-3">
                              <button className="text-xs px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-500 transition">
                                Edit
                              </button>
                              <button onClick={()=>deleteComment( comment.id)} className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition">
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Write comment input */}
              <div className="pt-3 border-t border-gray-700">
                <textarea
                  rows={2}
                  className="w-full p-2 rounded-md bg-footer text-sm text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                  placeholder="Write a comment..."
                  value={commentValueTxt[post.id] || ""}
                  onChange={(e) =>
                    setCommentValueTxt((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => addComment(post.id)}
                    className="text-sm bg-accent text-black px-3 py-1 rounded hover:bg-accent/90 transition"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {hasMore && (
          <div className="text-center mt-6">
            <button
              onClick={fetchCommunityPosts}
              disabled={loading}
              className="bg-accent px-4 py-2 rounded-md font-medium text-black hover:bg-accent/90 transition"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default CommunityPostPage;
