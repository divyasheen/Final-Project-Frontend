import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userImage from "../../assets/images/userImage.jpeg";
import { UserContext } from "../../contexts/userIdContext";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const CommunityPostPage = () => {
  const { community } = useParams();
  const navigate = useNavigate();
  // Simulated list of communities with their corresponding IDs
  const communities = [
    { id: 1, name: "Rules" },
    { id: 2, name: "Hello-world" },
    { id: 3, name: "HTML" },
    { id: 4, name: "Css" },
    { id: 5, name: "JavaScript" },
    { id: 6, name: "Off-Topic" },
    { id: 7, name: "General-Discussions" },
  ];

  // Determine selected community by name
  const selectedCommunity = communities.find((c) => c.name === community);
  const communityId = selectedCommunity?.id;
  const {  userId } = useContext(UserContext);

  // States for managing posts and pagination
  const [communityPosts, setCommunityPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [profileAvatars, setProfileAvatars] = useState({});

  // State for tracking which post's comments are shown
  const [visibleComments, setVisibleComments] = useState(null);
  // Track input value for new comments
  const [commentValueTxt, setCommentValueTxt] = useState({});
  // Track editing state
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  // State to track liked and disliked posts by current user
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [dislikedPosts, setDislikedPosts] = useState(new Set());

  const LIMIT = 10;

  // Fetch posts for selected community
  const fetchCommunityPosts = async (currentOffset = offset) => {
    if (!communityId || loading) return;
  
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/posts/communities/${communityId}?limit=${LIMIT}&offset=${currentOffset}`,
        { credentials: "include" }
      );
  
      if (!res.ok) throw new Error("Failed to fetch posts");
  
      const data = await res.json();
  
      const formattedPosts = data.map((post) => ({
        ...post,
        likes: post.like_count,
        dislikes: post.dislike_count,
      }));
  
      const existingPostIds = new Set(communityPosts.map((p) => p.id));
      const newPosts = formattedPosts.filter((p) => !existingPostIds.has(p.id));
      const combinedPosts = [...communityPosts, ...newPosts];
  
      const updatedLikedPosts = new Set();
      const updatedDislikedPosts = new Set();
  
      combinedPosts.forEach((post) => {
        if (post.userLiked) updatedLikedPosts.add(post.id);
        if (post.userDisliked) updatedDislikedPosts.add(post.id);
      });
  
      setLikedPosts(updatedLikedPosts);
      setDislikedPosts(updatedDislikedPosts);
      setCommunityPosts(combinedPosts);
  
      // ✅ update offset AFTER successful fetch
      setOffset(currentOffset + LIMIT);
  
      if (data.length < LIMIT) setHasMore(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Add new comment
  const addComment = async (postId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/posts/${postId}/comments`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
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
    } catch (err) {
      console.error("Add comment failed:", err);
    }
  };

  // Delete comment
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
              comments: post.comments.filter((c) => c.id !== commentId),
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("Delete comment failed:", err);
    }
  };

  // Save edited comment
  const saveEditedComment = async (commentId, postId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/posts/comments/${commentId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editedContent }),
        }
      );

      if (!res.ok) throw new Error("Failed to update comment");

      // Update the specific comment locally
      setCommunityPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment.id === commentId
                    ? { ...comment, content: editedContent }
                    : comment
                ),
              }
            : post
        )
      );

      setEditCommentId(null);
      setEditedContent("");
    } catch (err) {
      console.error("Save edit failed:", err);
    }
  };

  // Toggle comment section
  const showComments = (postId) => {
    setVisibleComments((prev) => (prev === postId ? null : postId));
  };

  // Like/unlike toggle function
  const toggleLike = async (postId) => {
    const isLiked = likedPosts.has(postId);
    try {
      const res = await fetch(`http://localhost:5000/posts/${postId}/like`, {
        method: isLiked ? "DELETE" : "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to toggle like");
      const data = await res.json();

      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        if (isLiked) newSet.delete(postId);
        else newSet.add(postId);
        return newSet;
      });

      if (!isLiked && dislikedPosts.has(postId)) {
        setDislikedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }

      setCommunityPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: data.like_count ?? post.likes, // fallback if undefined
                dislikes: data.dislike_count ?? post.dislikes,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Dislike/removeDislike toggle function
  const toggleDislike = async (postId) => {
    const isDisliked = dislikedPosts.has(postId);
    try {
      const res = await fetch(`http://localhost:5000/posts/${postId}/dislike`, {
        method: isDisliked ? "DELETE" : "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to toggle dislike");

      setDislikedPosts((prev) => {
        const newSet = new Set(prev);
        if (isDisliked) newSet.delete(postId);
        else newSet.add(postId);
        return newSet;
      });

      // If disliking, remove like if it exists
      if (!isDisliked && likedPosts.has(postId)) {
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }

      const data = await res.json(); // { like_count, disl

      setCommunityPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: data.like_count, dislikes: data.dislike_count }
            : post
        )
      );
    } catch (error) {
      console.error("Error toggling dislike:", error);
    }
  };

  const deleteSinglePost = async (postId) => {
    try {
      console.log("Attempting to delete post with ID:", postId);

      const res = await fetch(`http://localhost:5000/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete post");
      }

      // Remove the post from the state
      setCommunityPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId)
      );
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  // Reset posts on community change
  useEffect(() => {
    setCommunityPosts([]);
    setOffset(0);
    setHasMore(true);
  }, [communityId]);

  // Fetch on initial load or when offset resets
  useEffect(() => {
    if (communityId !== undefined && offset === 0) {
      fetchCommunityPosts();
    }
  }, [communityId]);

  // Fetch user avatar
  const fetchProfileAvatar = async (userId) => {
    try {
      const currentToken = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/user/${userId}/getProfilPic`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      const data = await response.json();

      // Save avatar keyed by userId
      setProfileAvatars((prev) => ({
        ...prev,
        [userId]: data.image_url,
      }));
    } catch (error) {
      console.error("Error fetching profileAvatar for user", userId, error);
    }
  };

  useEffect(() => {
    const uniqueUserIds = [
      ...new Set(communityPosts.map((post) => post.user_id)),
    ];

    uniqueUserIds.forEach((userId) => {
      if (!profileAvatars[userId]) {
        fetchProfileAvatar(userId);
      }
    });
  }, [communityPosts]);

  return (
    <main
      className={
        communityPosts.length > 0
          ? "p-5 bg-background min-h-screen text-white    "
          : '"p-5 bg-background min-h-screen text-white p-3  flex  "'
      }
    >
      <section
        className={
          communityPosts.length > 0
            ? "max-w-4xl mx-auto space-y-6 "
            : "max-w-4xl mx-auto space-y-6 flex flex-col items-center"
        }
      >
        <h1 className="text-secondary font-vt323 text-3xl mb-4">
          Posts in {community}
        </h1>

        {communityPosts.length === 0 ? (
          <p className="">No posts found for this community.</p>
        ) : (
          communityPosts.map((post) => (
            // setProfileImageUserId(post.user_id),

            <div
              key={post.id}
              className="relative border border-gray-700 p-4 rounded-md bg-primary hover:bg-secondary/20 transition space-y-4"
            >
              {/* Delete button */}
              {post.user_id === Number(userId) && (
                <button
                  onClick={() => deleteSinglePost(post.id)}
                  className="absolute top-2 right-2 w-10 h-10 text-white hover:text-red-600 font-bold"
                  aria-label="Delete post"
                  style={{ cursor: "pointer" }}
                >
                  X
                </button>
              )}

              {/* Post header */}
              <div className=" flex gap-4 items-center">
                <img
                  src={profileAvatars[post.user_id] || userImage}
                  alt="User"
                  className=" cursor-pointer
 w-12 h-12 object-cover rounded-full"
                  onClick={() => {
                    navigate(`/profile/${post.user_id}`);
                  }}
                />
                <div>
                  <h2 className="font-bold">{post.title}</h2>
                  <p role="button"   onClick={() => {
                    navigate(`/profile/${post.user_id}`);
                  }}  className="text-sm text-gray-300">{post.author}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Post body */}
              <p className="text-sm text-gray-200">{post.body}</p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1 ${
                    likedPosts.has(post.id) ? "text-green-500" : "text-gray-400"
                  } hover:text-green-400`}
                >
                  <FaThumbsUp />
                  {post.likes || 0}
                </button>

                <button
                  onClick={() => toggleDislike(post.id)}
                  className={`flex items-center gap-1 ${
                    dislikedPosts.has(post.id)
                      ? "text-red-500"
                      : "text-gray-400"
                  } hover:text-red-400`}
                >
                  <FaThumbsDown />
                  {post.dislikes || 0}
                </button>
              </div>
              {/* Show/Hide comments toggle */}
              {post.comments?.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => showComments(post.id)}
                    className="text-secondary underline text-sm hover:text-white"
                  >
                    {visibleComments === post.id
                      ? "Hide Comments"
                      : "Show Comments"}{" "}
                    ({post.comments.length})
                  </button>

                  {/* Comment section */}
                  {visibleComments === post.id && (
                    <div className="mt-3 border-t border-gray-600 pt-3 space-y-2">
                      {post.comments.map((comment) => {
                        const isEditing = editCommentId === comment.id;

                        return (
                          <div
                            key={comment.id}
                            className="text-sm border border-gray-700 p-2 rounded-md bg-background"
                          >
                            {/* Show editable text if editing */}
                            {isEditing ? (
                              <textarea
                                className="w-full text-sm p-2 bg-primary text-white border border-gray-600 rounded resize-none"
                                value={editedContent}
                                onChange={(e) =>
                                  setEditedContent(e.target.value)
                                }
                              />
                            ) : (
                              <p className="text-gray-300">{comment.content}</p>
                            )}

                            <div className="text-xs text-gray-500 mt-1">
                              by {comment.commenter ?? "Anonymous"} on{" "}
                              {new Date(
                                comment.created_at
                              ).toLocaleDateString()}
                            </div>

                            {/* Edit/Delete buttons if user is owner */}
                            {Number(userId) === comment.user_id && (
                              <div className="mt-2 flex gap-3">
                                {isEditing ? (
                                  <>
                                    <button
                                      className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
                                      onClick={() =>
                                        saveEditedComment(comment.id, post.id)
                                      }
                                    >
                                      Save
                                    </button>
                                    <button
                                      className="text-xs px-2 py-1 bg-gray-500 text-white rounded"
                                      onClick={() => {
                                        setEditCommentId(null);
                                        setEditedContent("");
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    className="text-xs px-2 py-1 bg-yellow-600 text-white rounded"
                                    onClick={() => {
                                      setEditCommentId(comment.id);
                                      setEditedContent(comment.content);
                                    }}
                                  >
                                    Edit
                                  </button>
                                )}
                                <button
                                  className="text-xs px-2 py-1 bg-red-600 text-white rounded"
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
                  )}
                </div>
              )}

              {/* New comment input */}
              <div className="pt-3 border-t border-gray-700">
                <textarea
                  rows={2}
                  className="w-full p-2 rounded-md bg-primary text-sm text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-secondary resize-none"
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
                    className="text-sm bg-secondary text-black px-3 py-1 rounded hover:bg-secondary/90"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Load more posts button */}
        {communityPosts.length > 0 && hasMore && (
          <div className="text-center mt-6">
            <button
              onClick={()=>fetchCommunityPosts()}
              disabled={loading}
              className="bg-secondary px-4 py-2 rounded-md font-medium text-black hover:bg-secondary/90"
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
