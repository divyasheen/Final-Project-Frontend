import React, { useState } from "react";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [community, setCommunity] = useState("");
  const [textValue, setTextValue] = useState("");

  const communities = [
    { id: 1, name: "Rules" },
    { id: 2, name: "Hello-world" },
    { id: 3, name: "HTML" },
    { id: 4, name: "Css" },
    { id: 5, name: "JavaScript" },
    { id: 6, name: "Off-Topic" },
    { id: 7, name: "General-Discussions" },
  ];
  const sendingThePost = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/posts", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          community_id: parseInt(community, 10),
          body: textValue,
        }),
      });

      if (!res.ok) {
        console.log("error");
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Post sent successfully:", data);
      setTitle("");
      setCommunity("");
      setTextValue("");
    } catch (error) {
      console.error("Error sending the post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1c] flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-3xl p-6 bg-primary rounded-2xl shadow-[0_8px_30px_rgba(255,255,255,0.4)]">
        <h2 className="text-accent text-3xl font-vt323 mb-6 border-b-2 border-accent pb-2">
          Create New Post
        </h2>

        <form onSubmit={sendingThePost} className="flex flex-col gap-6">
          {/* Title */}
          <div>
            <label className="block text-white text-sm mb-2">Title</label>
            <input
              type="text"
              className="w-full p-3 rounded-md bg-[#1e1e2f] text-white border border-accent placeholder:text-accent focus:outline-none"
              placeholder="Post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Community */}
          <div>
            <label className="block text-white text-sm mb-2">Community</label>
            <select
              className="w-full p-3 rounded-md bg-[#1e1e2f] text-white border border-accent focus:outline-none"
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a community
              </option>
              {communities.map((comm) => (
                <option key={comm.id} value={comm.id}>
                  {comm.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-white text-sm mb-2">Your Post</label>
            <textarea
              className="w-full p-4 h-64 rounded-md bg-[#1e1e2f] text-white border border-accent placeholder:text-accent focus:outline-none resize-none"
              placeholder="Write your post here..."
              onChange={(e) => setTextValue(e.target.value)}
              value={textValue}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="self-end bg-primary rounded-2xl px-6 py-2 text-sm font-medium text-white shadow-[0_0px_12px_rgba(171,239,254,0.5),0_0px_40px_rgba(0,254,254,0.2)] hover:shadow-[0_0px_12px_rgba(171,239,254,0.5),0_0px_40px_rgba(171,239,254,0.25)]"
          >
            Publish
          </button>
        </form>
      </section>
    </div>
  );
};

export default CreatePost;
