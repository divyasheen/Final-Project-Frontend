import userImage from "../../assets/images/userImage.jpeg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Forumia() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('An unexpected error');
  const [calcMembers, setCalcMembers] = useState(null);
  const [threadCount, setThreadCount] = useState(0);


  const navigate=useNavigate()
  //fetching the posts from the database
  useEffect(() => {
    const fetchingData = async () => {
      try {
        const res = await fetch("http://localhost:5000/posts");

        if (!res.ok) {
          setMessage("Something went wrong fetching posts");
          return; // stop here if response not OK
        }

        const data = await res.json();
        console.log(data);

        setPosts(data); // update state here
        setMessage(null); // clear any previous messages on success
      } catch (error) {
        console.log(error);
        setMessage(error?.message || message);
      }
    };

    fetchingData();
  }, []);

  //Calculating Threads

  useEffect(() => {
    const total = posts.reduce((acc, post) => {
      return acc + 1 + (post.comments?.length || 0);
    }, 0);
    setThreadCount(total);
  }, [posts]);

  useEffect(() => {
    const members = new Set();

    posts.forEach((post) => {
      // Add post author
      if (post.author) members.add(post.author);

      // Add comment authors, if any
      post.comments?.forEach((comment) => {
        if (comment.author) members.add(comment.author);
      });
    });

    setCalcMembers(members.size); // setMemberCount should be a useState setter
    // Optional: log who they are
  }, [posts]);

  return (
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
                  onClick={() => navigate(`posts/${post.community}`)}
                  className="mt-6 w-full max-w-xs cursor-pointer hover:bg-accent/20 p-3 rounded-md flex items-center gap-4"
                >
                  <img
                    className="object-cover w-12 h-12 rounded-full"
                    src={userImage}
                    alt="user avatar"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">{post.title || "No content"}</p>
                    <p className="text-[11px] text-gray-300">{post.author}</p>
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
            
            <a href="/createPost" target="_blank" rel="noopener noreferrer">
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
            {posts.slice(0, 3).map((post) => (
  <div
    key={post.id}
    className="cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-accent pb-4 hover:bg-accent/20 p-3 hover:rounded-md  transition-colors"
    onClick={() => console.log(`Clicked post with id: ${post.id}`)}
    role="button"
    tabIndex={0}
    onKeyPress={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        console.log(`Clicked post with id: ${post.id}`);
      }
    }}
  >
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
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>

    {/* Right side */}
    <div className="flex gap-6 items-center w-full sm:w-1/3 mt-4 sm:mt-0 justify-evenly text-white text-sm relative">
      <p className="flex flex-col text-[11px] items-center">
        Answers
        <span className="px-2">{post.comments.length}</span>
      </p>
      <div className="relative flex items-center gap-4 before:absolute before:left-[-15px] before:h-full before:w-[2px] before:bg-accent before:rounded">
        <img
          src={userImage} // or post.latestAnswerUserImage if available
          alt="latest-answer-user"
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="flex flex-col items-center text-[11px]">
          UserName
          <span className="text-[11px] text-accent">27.05.2025</span>
        </p>
      </div>
    </div>
  </div>
))}

            
          </article>

          {/*General */}
          <article className=" w-[90%] max-w-full mx-auto mt-10 p-6">
            <h3 className="text-white border-b-4 py-4 border-accent font-vt323 text-[25px] font-normal ">
              General
            </h3>

            <div className="flex flex-col gap-8 mt-5">
              {/* === POST 1 === */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-accent pb-4 min-h-[64px]">
                {/* Left side */}
                <div className="flex gap-4 w-full sm:w-2/3 items-center">
                  {/* <img
          src={userImage}
          alt="user"
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        /> */}
                  <div className="text-white text-sm">
                    <p className="font-bold text-md mb-1">Rules</p>
                    <div className="text-[11px] flex gap-1">
                      <span>Learn the Do's and Don't's of Forumioa</span>
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex gap-6 items-center w-full sm:w-1/3 mt-4 sm:mt-0 justify-evenly text-white text-sm relative min-h-[64px]">
                  <p className="flex flex-col text-[11px] items-center">
                    Threads
                    <span className="px-2">5</span>
                  </p>
                  <p className="relative before:absolute before:top-2 before:left-[-15px] before:h-4/5 before:w-[1px] before:bg-accent before:rounded flex flex-col text-[11px] items-center">
                    Posts
                    <span className="px-2">105</span>
                  </p>
                  <div className="relative flex items-center gap-4 before:absolute before:left-[-15px] before:h-4/5 before:w-[2px] before:bg-accent before:rounded">
                    <img
                      src={userImage}
                      alt="latest-answer-user"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex w-3/5 flex-col items-start text-[11px] max-w-[100px]">
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap w-full block text-left">
                        Rules at the Forum
                      </p>
                      <span className="text-[11px]">User1</span>
                      <span className="text-[11px] text-accent">
                        27.05.2025
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* === POST 2 === */}
              <div className="flex  flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-accent pb-4 min-h-[64px]">
                {/* Left side */}
                <div className="flex gap-4 w-full sm:w-2/3 items-center">
                  {/* <img
          src={userImage}
          alt="user"
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        /> */}
                  <div className="text-white text-sm">
                    <p className="font-bold text-md mb-1">Hello World</p>
                    <div className="text-[11px] flex gap-1">
                      <span>Introduce yourself</span>
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex gap-6 items-center w-full sm:w-1/3 mt-4 sm:mt-0 justify-evenly text-white text-sm relative min-h-[64px]">
                  <p className="flex flex-col text-[11px] items-center">
                    Threads
                    <span className="px-2">10</span>
                  </p>
                  <p className="relative before:absolute before:top-2 before:left-[-15px] before:h-4/5 before:w-[1px] before:bg-accent before:rounded flex flex-col text-[11px] items-center">
                    Posts
                    <span className="px-2">105</span>
                  </p>
                  <div className="relative flex items-center gap-4 before:absolute before:left-[-15px] before:h-4/5 before:w-[2px] before:bg-accent before:rounded">
                    <img
                      src={userImage}
                      alt="latest-answer-user"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="w-3/5 flex flex-col items-start text-[11px] max-w-[100px]">
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap w-full block text-left">
                        Hi There this is a long text that should be truncated
                      </p>
                      <span>User2</span>
                      <span className="text-accent">10.02.2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/*University of Terminalia */}
          <article className=" w-[90%] max-w-full mx-auto mt-10 p-6">
            <h3 className="text-white border-b-4 py-4 border-accent font-vt323 text-[25px] font-normal ">
              University of Terminalia
            </h3>

            <div className="flex flex-col gap-8 mt-5">
              {/* === POST 1 === */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-accent pb-4 min-h-[64px]">
                {/* Left side */}
                <div className="flex gap-4 w-full sm:w-2/3 items-center">
                  {/* <img
          src={userImage}
          alt="user"
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        /> */}
                  <div className="text-white text-sm">
                    <p className="font-bold text-md mb-1">HTML</p>
                    <div className="text-[11px] flex gap-1">
                      <span>
                        Ask your questions about the lessons in the HTML course,
                        Share your knowledge
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex gap-6 items-center w-full sm:w-1/3 mt-4 sm:mt-0 justify-evenly text-white text-sm relative min-h-[64px]">
                  <p className="flex flex-col text-[11px] items-center">
                    Threads
                    <span className="px-2">5</span>
                  </p>
                  <p className="relative before:absolute before:top-2 before:left-[-15px] before:h-4/5 before:w-[1px] before:bg-accent before:rounded flex flex-col text-[11px] items-center">
                    Posts
                    <span className="px-2">105</span>
                  </p>
                  <div className="relative flex items-center gap-4 before:absolute before:left-[-15px] before:h-4/5 before:w-[2px] before:bg-accent before:rounded">
                    <img
                      src={userImage}
                      alt="latest-answer-user"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex w-3/5 flex-col items-start text-[11px] max-w-[100px]">
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap w-full block text-left">
                        Rules at the Forum
                      </p>
                      <span className="text-[11px]">User1</span>
                      <span className="text-[11px] text-accent">
                        27.05.2025
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* === POST 2 === */}
              <div className="flex  flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-accent pb-4 min-h-[64px]">
                {/* Left side */}
                <div className="flex gap-4 w-full sm:w-2/3 items-center">
                  {/* <img
          src={userImage}
          alt="user"
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        /> */}
                  <div className="text-white text-sm">
                    <p className="font-bold text-md mb-1">Css</p>
                    <div className="text-[11px] flex gap-1">
                      <span>
                        Ask your questions about the lessons in the CSS course,
                        Share your knowledge
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex gap-6 items-center w-full sm:w-1/3 mt-4 sm:mt-0 justify-evenly text-white text-sm relative min-h-[64px]">
                  <p className="flex flex-col text-[11px] items-center">
                    Threads
                    <span className="px-2">10</span>
                  </p>
                  <p className="relative before:absolute before:top-2 before:left-[-15px] before:h-4/5 before:w-[1px] before:bg-accent before:rounded flex flex-col text-[11px] items-center">
                    Posts
                    <span className="px-2">105</span>
                  </p>
                  <div className="relative flex items-center gap-4 before:absolute before:left-[-15px] before:h-4/5 before:w-[2px] before:bg-accent before:rounded">
                    <img
                      src={userImage}
                      alt="latest-answer-user"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="w-3/5 flex flex-col items-start text-[11px] max-w-[100px]">
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap w-full block text-left">
                        Hi There this is a long text that should be truncated
                      </p>
                      <span>User2</span>
                      <span className="text-accent">10.02.2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Post3 */}

            <div className="flex  flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-accent pb-4 min-h-[64px]">
              {/* Left side */}
              <div className="flex gap-4 w-full sm:w-2/3 items-center">
                {/* <img
          src={userImage}
          alt="user"
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        /> */}
                <div className="text-white text-sm">
                  <p className="font-bold text-md mb-1">JavaScript</p>
                  <div className="text-[11px] flex gap-1">
                    <span>
                      Ask your questions about the lessons in the JavaScript
                      course, Share your knowledge
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex gap-6 items-center w-full sm:w-1/3 mt-4 sm:mt-0 justify-evenly text-white text-sm relative min-h-[64px]">
                <p className="flex flex-col text-[11px] items-center">
                  Threads
                  <span className="px-2">10</span>
                </p>
                <p className="relative before:absolute before:top-2 before:left-[-15px] before:h-4/5 before:w-[1px] before:bg-accent before:rounded flex flex-col text-[11px] items-center">
                  Posts
                  <span className="px-2">105</span>
                </p>
                <div className="relative flex items-center gap-4 before:absolute before:left-[-15px] before:h-4/5 before:w-[2px] before:bg-accent before:rounded">
                  <img
                    src={userImage}
                    alt="latest-answer-user"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="w-3/5 flex flex-col items-start text-[11px] max-w-[100px]">
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap w-full block text-left">
                      Hi There this is a long text that should be truncated
                    </p>
                    <span>User2</span>
                    <span className="text-accent">10.02.2025</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/*The Hub */}
          <article className=" w-[90%] max-w-full mx-auto mt-10 p-6">
            <h3 className="text-white border-b-4 py-4 border-accent font-vt323 text-[25px] font-normal ">
              The Hub
            </h3>

            <div className="flex flex-col gap-8 mt-5">
              {/* === POST 1 === */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-accent pb-4 min-h-[64px]">
                {/* Left side */}
                <div className="flex gap-4 w-full sm:w-2/3 items-center">
                  {/* <img
          src={userImage}
          alt="user"
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        /> */}
                  <div className="text-white text-sm">
                    <p className="font-bold text-md mb-1">Off-Topic</p>
                    <div className="text-[11px] flex gap-1">
                      <span>What ever comes to yuor mind</span>
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex gap-6 items-center w-full sm:w-1/3 mt-4 sm:mt-0 justify-evenly text-white text-sm relative min-h-[64px]">
                  <p className="flex flex-col text-[11px] items-center">
                    Threads
                    <span className="px-2">5</span>
                  </p>
                  <p className="relative before:absolute before:top-2 before:left-[-15px] before:h-4/5 before:w-[1px] before:bg-accent before:rounded flex flex-col text-[11px] items-center">
                    Posts
                    <span className="px-2">105</span>
                  </p>
                  <div className="relative flex items-center gap-4 before:absolute before:left-[-15px] before:h-4/5 before:w-[2px] before:bg-accent before:rounded">
                    <img
                      src={userImage}
                      alt="latest-answer-user"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex w-3/5 flex-col items-start text-[11px] max-w-[100px]">
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap w-full block text-left">
                        Rules at the Forum
                      </p>
                      <span className="text-[11px]">User1</span>
                      <span className="text-[11px] text-accent">
                        27.05.2025
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* === POST 2 === */}
              <div className="flex  flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-accent pb-4 min-h-[64px]">
                {/* Left side */}
                <div className="flex gap-4 w-full sm:w-2/3 items-center">
                  {/* <img
          src={userImage}
          alt="user"
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        /> */}
                  <div className="text-white text-sm">
                    <p className="font-bold text-md mb-1">
                      General Discussions
                    </p>
                    <div className="text-[11px] flex gap-1">
                      <span>What ever comes to your mind</span>
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex gap-6 items-center w-full sm:w-1/3 mt-4 sm:mt-0 justify-evenly text-white text-sm relative min-h-[64px]">
                  <p className="flex flex-col text-[11px] items-center">
                    Threads
                    <span className="px-2">10</span>
                  </p>
                  <p className="relative before:absolute before:top-2 before:left-[-15px] before:h-4/5 before:w-[1px] before:bg-accent before:rounded flex flex-col text-[11px] items-center">
                    Posts
                    <span className="px-2">105</span>
                  </p>
                  <div className="relative flex items-center gap-4 before:absolute before:left-[-15px] before:h-4/5 before:w-[2px] before:bg-accent before:rounded">
                    <img
                      src={userImage}
                      alt="latest-answer-user"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="w-3/5 flex flex-col items-start text-[11px] max-w-[100px]">
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap w-full block text-left">
                        Hi There this is a long text that should be truncated
                      </p>
                      <span>User2</span>
                      <span className="text-accent">10.02.2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Post3 */}
          </article>
        </aside>
      </div>
    </main>
  );
}
