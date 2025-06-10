import React from 'react';

const posts = [
  {
    id: 1,
    title: "Rules",
    description: "Learn the Do's and Don't's of Forumioa",
    threads: 5,
    posts: 105,
    latestAnswerUser: "User1",
    latestAnswerDate: "27.05.2025",
    latestAnswerText: "Rules at the Forum",
    userImage: "", // Add user image URL here later
  },
  {
    id: 2,
    title: "Hello World",
    description: "Introduce yourself",
    threads: 10,
    posts: 105,
    latestAnswerUser: "User2",
    latestAnswerDate: "10.02.2025",
    latestAnswerText: "Hi There this is a long text that should be truncated",
    userImage: "", // Add user image URL here later
  },
];

const General = () => {
  return (
    <article className="w-[90%] max-w-full mx-auto mt-10 p-6">
      <h3 className="text-white border-b-4 py-4 border-accent font-vt323 text-[25px] font-normal">
        General
      </h3>

      <div className="flex flex-col  mt-5 ">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-accent  min-h-[64px]  cursor-pointer  hover:bg-accent/20 p-3 hover:rounded-md transition-colors"
            role='button'
          >
            {/* Left side */}
            <div className="flex gap-4 w-full sm:w-2/3 items-center">
              {/* User Image (uncomment and add src when ready) */}
              {/* {post.userImage && (
                <img
                  src={post.userImage}
                  alt="user"
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
              )} */}
              <div className="text-white text-sm">
                <p className="font-bold text-md mb-1">{post.title}</p>
                <div className="text-[11px] flex gap-1">
                  <span>{post.description}</span>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex gap-6 items-center w-full sm:w-1/3 mt-4 sm:mt-0 justify-evenly text-white text-sm relative min-h-[64px]">
              <p className="flex flex-col text-[11px] items-center">
                Threads
                <span className="px-2">{post.threads}</span>
              </p>
              <p className="relative before:absolute before:top-2 before:left-[-15px] before:h-4/5 before:w-[1px] before:bg-accent before:rounded flex flex-col text-[11px] items-center">
                Posts
                <span className="px-2">{post.posts}</span>
              </p>
              <div className="relative flex items-center gap-4 before:absolute before:left-[-15px] before:h-4/5 before:w-[2px] before:bg-accent before:rounded">
                {/* User Image (uncomment and add src when ready) */}
                {/* {post.userImage && (
                  <img
                    src={post.userImage}
                    alt="latest-answer-user"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )} */}
                <div className="flex w-3/5 flex-col items-start text-[11px] max-w-[100px]">
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap w-full block text-left">
                    {post.latestAnswerText}
                  </p>
                  <span>{post.latestAnswerUser}</span>
                  <span className="text-accent">{post.latestAnswerDate}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default General;
