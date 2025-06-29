import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello, I'm J.A.D.A." },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const endRef = useRef(null);

  useEffect(() => {
    if (hasInteracted && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, hasInteracted]);

  useEffect(() => {
    return () => {
      document.body.classList.remove("chat-active");
    };
  }, []);

  useEffect(() => {
    if (messages.some((msg) => msg.role !== "system")) {
      setHasInteracted(true);
      document.body.classList.add("chat-active");
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      console.log(res);

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);

      if (!hasInteracted) {
        setHasInteracted(true);
        document.body.classList.add("chat-active");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessages([
        ...newMessages,
        { role: "system", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
    console.log("hasInteracted =", hasInteracted);
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      <div
        className={`transition-all duration-500 ease-in-out w-full max-w-xl mx-auto p-4 text-white flex-1 ${
          hasInteracted
            ? "flex flex-col translate-y-0"
            : "flex justify-center items-center flex-col translate-y-1/3"
        }`}
      >
        <div
          className={`transition-all duration-500 ease-in-out overflow-y-auto px-8 py-2 space-y-4 ${
            hasInteracted
              ? "flex-1 opacity-100 scale-100"
              : "max-h-0 opacity-0 scale-95 overflow-hidden pointer-events-none"
          }`}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`
                p-4 my-1 rounded-lg text-sm max-w-[85%] whitespace-pre-wrap
                ${
                  msg.role === "user"
                    ? "bg-secondary text-black self-end ml-20 text-right"
                    : "bg-surface text-gray-300 self-start mr-20 text-left"
                }
              `}
            >
              <ReactMarkdown
                children={msg.content}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeText = String(children).replace(/\n$/, "");

                    return !inline && match ? (
                      <div className="relative group overflow-x-auto rounded-lg">
                        <button
                          className="absolute top-2 right-2 text-xs bg-white/10 text-white border border-white/20 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                          onClick={() =>
                            navigator.clipboard.writeText(codeText)
                          }
                          aria-label="Copy code to clipboard"
                        >
                          Copy
                        </button>

                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            borderRadius: "0.5rem",
                            padding: "1rem",
                            fontSize: "0.9rem",
                            overflowX: "auto",
                          }}
                          {...props}
                        >
                          {codeText}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code
                        className="bg-codeBlock px-1 py-0.5 rounded"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              />
            </div>
          ))}
          {loading && (
            <p className="text-left text-sm text-gray-400 italic">
              J.A.D.A. is typing…
            </p>
          )}
          <div ref={endRef} />
        </div>

        <div
          className={`mt-4 w-full flex-shrink-0 px-8 ${
            hasInteracted ? "" : "max-w-md"
          }`}
        >
          <div className="flex gap-2">
            <input
              className="flex-1 bg-transparent border border-secondary text-black rounded-xl px-3 py-2 focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
            />
            <button
              className="bg-secondary text-black px-4 py-2 rounded-xl disabled:opacity-50 hover:bg-secondaryHover transition"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
