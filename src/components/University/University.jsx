// University.jsx
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import universityImage from "../../assets/images/university.png";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

/* ─────────────── ChatBot pane ─────────────── */
function ChatBot({ isOpen, onClose }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello 👋 – how can I help?" },
  ]);

  const send = async () => {
    if (!msg.trim()) return;

    setMessages((m) => [...m, { from: "user", text: msg.trim() }]);
    setMsg("");
    // call chatbot backend here and push its reply
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { from: "user", text: msg.trim() }].map(
            (m) => ({
              role: m.from === "user" ? "user" : "assistant",
              content: m.text,
            })
          ),
        }),
      });

      const data = await res.json();

      setMessages((m) => [...m, { from: "bot", text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { from: "bot", text: "⚠️ Something went wrong. Try again later." },
      ]);
    }
  };

  return (
    <aside
      className={`
        fixed right-0 top-0 h-full w-[500px] bg-footer border-l border-accent
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        z-50
        flex flex-col
      `}
    >
      <header className="p-3 border-b border-accent text-accent font-bold flex justify-between items-center">
        <span>Bot</span>
        <button
          onClick={onClose}
          className="text-white text-sm hover:text-accent px-2 py-1"
          aria-label="Close chat"
        >
          ✕
        </button>
      </header>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className="text-sm">
            {m.from === "user" ? (
              <p className="text-right text-white">{m.text}</p>
            ) : (
              <div className="prose prose-invert text-left text-gray-300 max-w-none">
                <ReactMarkdown
                  components={{
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-gray-800 text-accent px-1 rounded"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {m.text}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* input bar */}
      <div className="p-2 border-t border-accent flex gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 bg-black text-white text-sm px-2 py-1 rounded border border-accent focus:outline-none"
          placeholder="Type your question…"
        />
      </div>
    </aside>
  );
}
/* ─────────── end ChatBot pane ─────────── */

const STORAGE_KEY = "universityCode";
const DEFAULT_CODE = `<!DOCTYPE html>
<html>
<head>
  <title>My First HTML Hut</title>
</head>
<body>
  <h1>University Village</h1>
  <p>Build your first HTML hut here.</p>
</body>
</html>`;

export default function University() {
  const { exerciseId } = useParams();
  const [code, setCode] = useState(
    () => localStorage.getItem(STORAGE_KEY) || DEFAULT_CODE
  );
  const [srcDoc, setSrcDoc] = useState("");
  const [botOpen, setBotOpen] = useState(false); // controls open/close

  const run = () => setSrcDoc(code);

  const handleBotClose = () => setBotOpen(false);

  return (
    <div
      className={`
      relative flex flex-col h-screen bg-background text-white font-vt323
      transition-all duration-300 ease-in-out
      ${botOpen ? "pr-[500px]" : ""}
      `}
    >
      {/* Header */}
      <header
        className="relative w-full h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${universityImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-5xl text-accent font-bold">
            UNIVERSITY OF TERMINALIA
          </h1>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden p-2 rounded-md border border-accent m-4">
        {/* Left - Content */}
        <div className="w-1/2 p-4 space-y-6">
          <h2 className="text-2xl font-semibold">Name of exercise</h2>

          <div>
            <h3 className="text-accent text-lg mb-1">Topic</h3>
            <p className="text-sm text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
              Ettam eros erot, interdum vitae viverra sed, congue eu urna.
            </p>
            <div className="bg-footer text-white p-3 mt-2 rounded text-sm">
              <strong className="text-white">
                &lt;Lot’s of informations which will explain the topic.&gt;
              </strong>
              <br />
              Like what are loops. How they work, how to code them
            </div>
          </div>

          <div>
            <h3 className="text-accent text-lg mb-1">Instruction</h3>
            <p className="text-sm text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
              Ettam eros erot, interdum vitae viverra sed, congue eu urna.
            </p>
          </div>

          <div>
            <h3 className="text-accent text-lg mb-1">Example</h3>
            <p className="text-sm text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
              Ettam eros erot, interdum vitae viverra sed, congue eu urna.
            </p>
          </div>
        </div>

        {/* Right - Code & Terminal */}
        <div className="w-1/2 flex flex-col border-l border-accent">
          {/* Editor Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-accent">
            <h3 className="text-accent text-xl">Code.js</h3>
            <div className="space-x-2">
              <button
                onClick={run}
                className="bg-accent text-black px-3 py-1 rounded hover:bg-accentHover"
              >
                RUN
              </button>
              <button
                onClick={() => setBotOpen((o) => !o)} // toggles open and close
                className="bg-footer text-white px-3 py-1 rounded border border-accent hover:bg-accentHover"
              >
                {botOpen ? "Close Bot" : "Ask Bot"}
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="html"
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{
                minimap: { enabled: false },
                theme: "vs-dark",
                fontSize: 14,
                fontFamily: "VT323",
              }}
            />
          </div>

          {/* Terminal */}
          <div className="h-56 border-t border-accent p-2 bg-black text-white text-sm overflow-auto">
            <h4 className="mb-1 text-accent">Terminal</h4>
            {srcDoc ? (
              <iframe
                srcDoc={srcDoc}
                sandbox="allow-scripts"
                className="w-full h-full bg-white"
                title="Preview"
              />
            ) : (
              <div className="text-gray-400">
                Output will appear here after clicking RUN.
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center p-4 border-t border-accent">
            <button className="px-4 py-1 bg-footer border border-accent rounded hover:bg-accentHover">
              Previous
            </button>
            <button
              onClick={run}
              className="px-4 py-1 bg-accent text-black rounded hover:bg-accentHover"
            >
              Complete
            </button>
            <button className="px-4 py-1 bg-footer border border-accent rounded hover:bg-accentHover">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* chatbot mounted once */}
      <ChatBot isOpen={botOpen} onClose={handleBotClose} />
    </div>
  );
}
