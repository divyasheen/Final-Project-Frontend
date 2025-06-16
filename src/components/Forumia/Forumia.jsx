/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import userImage from "../../assets/images/userImage.jpeg";
import { useState, useContext, useEffect } from "react";

import General from "./General";
import SinglePostAndComments from "../SinglePostAndComments/SinglePostAndComments";
import UniversityOfTerminalia from "./UniversityOfTerminalia";
import TheHub from "./TheHub";
import { UserContext } from "../../contexts/userIdContext";

export default function Forumia() {
  const [calcMembers, setCalcMembers] = useState(null);
  const [threadCount, setThreadCount] = useState(0);
  const [renderSinglePostPage, setRenderSinglePostPage] = useState(false);
  const [singlePostInfos, setSinglePostObject] = useState({});

  const LIMIT = 10; // Define a constant for the limit of posts per page
  const { posts, userId, setPosts, fetchingData } = useContext(UserContext);

  // useEffect(() => {
  //   fetchingData();
  // }, [posts, fetchingData]);
  useEffect(() => {
    fetchingData(LIMIT, 0);
    // setOffset(LIMIT); // next offset will be LIMIT
    console.log("Fetching data called");
  }, []);


  //Calculating Threads

  useEffect(() => {
    const total = posts.reduce((acc, post) => {
      return acc + 1 + (post.comments?.length || 0);
    }, 0);
    setThreadCount(total);
  }, [posts]);
  // Calculating Members
  useEffect(() => {
    const members = new Set();

    posts.forEach((post) => {
      // Add post author
      if (post.author) members.add(post.author);

      // Add comment commenter
      post.comments?.forEach((comment) => {
        if (comment.commenter) members.add(comment.commenter);
      });
    });

    setCalcMembers(members.size); // setMemberCount should be a useState setter
    // Optional: log who they are
  }, [posts]);

  //  sending The user to the single Post

  const oneSinglePost = (post) => {
    setSinglePostObject(post);
    setRenderSinglePostPage(true);
  };
  //Delete a single post

  const deleteSinglePost = async (postId) => {
    try {
      console.log("Attempting to delete post with ID:", postId);

      const res = await fetch(`http://localhost:5000/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      // const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to delete post");
      }

      // Remove the post from the state
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <>
      {/* overlay with the single post component  */}
      {renderSinglePostPage && (
        <SinglePostAndComments
          post={posts}
          singlePostInfos={singlePostInfos}
          setSinglePostObject={setSinglePostObject}
          setRenderSinglePostPage={setRenderSinglePostPage}
          refreshPosts={() => fetchingData(LIMIT, 0)}

        />
      )}
      <main className="flex flex-col p-5 bg-background">
        <div className="flex flex-col md:flex-row gap-10  m-auto w-[80%] px-4 md:px-0">
          {/* left side */}
          <section className="w-full md:w-1/3 space-y-8 ">
            <article className="p-6 text-white bg-background border-2 border-accent rounded-md md:rounded-2xl py-14 shadow-[0_8px_30px_rgba(255,255,255,0.4)]">
              <h3 className=" font-vt323 text-[25px] font-normal  text-accent">
                Members online
              </h3>
              {/* Loop here */}
              <p className="py-2">User1, Doniweb, Edal, TommysNetwork</p>
            </article>
            <article className="p-6 text-white bg-background border-2 max-h-[450px] overflow-y-auto  custom-scrollbar  border-accent rounded-md md:rounded-2xl shadow-[0_8px_30px_rgba(255,255,255,0.4)]">
              <h3 className="font-vt323 w-full  text-[25px] font-normal text-accent">
                Top
              </h3>

              {posts.length === 0 ? (
                <p className="text-white text-sm mt-4">No Available Posts </p>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => oneSinglePost(post)}
                    className="relative mt-6 w-full max-w-xs cursor-pointer hover:bg-accent/20 p-3 rounded-md overflow-hidden flex items-center gap-4 border border-gray-700"
                  >
                    {/* Delete Button - styled and positioned in top-right */}

                    {Number(userId) === post.user_id && (
                      <button
                        aria-label="Delete post"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent parent div click
                          deleteSinglePost(post.id);
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-md bg-red font-bold transition duration-200"
                        title="Delete Post"
                      >
                        ×
                      </button>
                    )}

                    <img
                      className="object-cover w-12 h-12 rounded-full"
                      src={userImage}
                      alt="user avatar"
                    />

                    <div className="flex flex-col gap-1">
                      <p className="font-semibold truncate">
                        {post.title || "No content"}
                      </p>
                      <p className="text-[11px] text-gray-300 truncate">
                        {post.author}
                      </p>
                      <span className="text-[11px] text-gray-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </article>

            <article className="p-6 text-white bg-background border-2 border-accent rounded-md md:rounded-2xl shadow-[0_8px_30px_rgba(255,255,255,0.4)]">
              <h3 className="font-vt323 text-[25px] font-normal  text-accent">
                Forum Statistics
              </h3>
              <ul className="mt-6 flex flex-col gap-4 max-w-xs">
                <li className="flex justify-between w-full">
                  Threads: <span>{threadCount}</span>
                </li>
                <li className="flex justify-between w-full">
                  Posts: <span>{posts.length}</span>
                </li>
                <li className="flex justify-between w-full">
                  Members: <span>{calcMembers}</span>
                </li>
                <li className="flex justify-between w-full">
                  Latest Member:{" "}
                  <span> {posts?.[posts.length - 1]?.author || "N/A"}</span>
                </li>
              </ul>
            </article>
          </section>

          {/* right side */}
          <aside className="w-full border-2 border-accent rounded-md md:rounded-2xl  py-14 shadow-[0_8px_30px_rgba(255,255,255,0.4)]">
            {/* Buttons */}
            <article className="flex gap-4 justify-end items-center px-6">
              <a href="/createPost" rel="noopener noreferrer">
                <button className="bg-footer rounded-2xl p-2 px-3 text-sm font-medium text-white shadow-[0_0px_12px_rgba(171,239,254,0.5),0_0px_40px_rgba(0,254,254,0.2)] hover:shadow-[0_0px_12px_rgba(171,239,254,0.5),0_0px_40px_rgba(171,239,254,0.25)]">
                  New Post
                </button>
              </a>
            </article>

            {/* Latest Posts */}
            <article className="bg-footer w-[90%] max-w-full mx-auto mt-10 p-6  rounded-md">
              <h3 className="text-accent mb-8 font-vt323 text-[25px] font-normal ">
                Latest Posts
              </h3>
              {posts.length > 0 ? (
                posts.slice(0, 3).map((post) => (
                  <div
                    key={post.id}
                    onClick={() => oneSinglePost(post)}
                    className="relative cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-accent pb-4 hover:bg-accent/20 p-3 hover:rounded-md transition-colors"
                    role="button"
                    tabIndex={0}
                  >
                    {/* ❌ Delete Button (conditionally shown for post author) */}
                    {Number(userId) === post.user_id && (
                      <button
                        aria-label="Delete post"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents triggering post click
                          deleteSinglePost(post.id);
                        }}
                        className="absolute top-0 right-2 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 text-2xl font-bold transition duration-200 cursor-pointer"
                        title="Delete Post"
                      >
                        ×
                      </button>
                    )}

                    {/* Left side */}
                    <div className="flex gap-4 w-full sm:w-2/3 items-center">
                      <img
                        src={post.userImage || userImage} // fallback if no userImage
                        alt={post.author || "user"}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="text-white text-sm">
                        <p className="font-bold text-md mb-1">{post.title}</p>
                        <div className="text-[11px] text-accent flex gap-1">
                          <span>{post.author} -</span>
                          <span>
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex gap-6 items-center w-full sm:w-1/3 mt-4 sm:mt-0 justify-evenly text-white text-sm relative">
                      <p className="flex flex-col text-[11px] items-center">
                        Answers
                        <span className="px-2">{post.comments.length}</span>
                      </p>
                      {post.comments.length > 0 && (
                        <div className="relative flex items-center gap-4 before:absolute before:left-[-15px] before:h-full before:w-[2px] before:bg-accent before:rounded">
                          <img
                            src={userImage} // or post.latestAnswerUserImage if available
                            alt="latest-answer-user"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <p className="flex flex-col items-center text-[11px]">
                            {post.comments[post.comments.length - 1].commenter}
                            <span className="text-[11px] text-accent">
                              {" "}
                              {new Date(
                                post.comments[
                                  post.comments.length - 1
                                ].created_at
                              ).toLocaleDateString()}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white text-sm mt-4">No Available Posts </p>
              )}
            </article>

            {/*General */}
            <General posts={posts} />

            {/*University of Terminalia */}
            <UniversityOfTerminalia posts={posts} />

            {/*The Hub */}
            <TheHub posts={posts} />
          </aside>
        </div>
      </main>
    </>
  );
}
