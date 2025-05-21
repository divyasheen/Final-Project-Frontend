import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useParams, useNavigate } from "react-router-dom";
import universityImage from "../../assets/images/university.png";
import { toast } from "react-toastify";

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

export default function University() {

  /* ─────────────── ChatBot pane ─────────────── */
  const [botOpen, setBotOpen] = useState(false)
  const handleBotClose = () => setBotOpen(false)
  /* ────────────end ChatBot pane ─────────────── */


  const { exerciseId } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [exercise, setExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [terminalOutput, setTerminalOutput] = useState("");

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/courses/exercises/${exerciseId}`
        );
        if (!response.ok) throw new Error("Failed to fetch exercise");
        const data = await response.json();
        setExercise(data);
        const savedCode = localStorage.getItem(`${STORAGE_KEY}_${exerciseId}`);
        setCode(savedCode || "");
        setIsLoading(false);
      } catch (err) {
        toast.error(err.message);
        navigate("/university");
      }
    };

    fetchExercise();
  }, [exerciseId, navigate]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_${exerciseId}`, code);
  }, [code, exerciseId]);

  const run = async () => {
    try {
      // Reset completion status before running new tests
      setIsCompleted(false);

      const res = await fetch(
        "http://localhost:5000/api/evaluations/evaluate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            exerciseId,
            language: exercise?.language || "html",
          }),
        }
      );

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error("Evaluation failed");
      }

      setTestResults(result.tests);
      setTerminalOutput(
        result.tests
          .map(
            (test, i) =>
              `#${i + 1}: ${test.description || test.test_type} - ${
                test.passed ? "✅ Passed" : "❌ Failed"
              }\nExpected: ${test.expected_value}\nActual: ${
                test.actual || "N/A"
              }\n`
          )
          .join("\n")
      );

      // Only set as completed if ALL tests pass
      const allTestsPassed = result.tests.every((test) => test.passed);
      if (allTestsPassed) {
        setIsCompleted(true);
        toast.success(`✅ All tests passed! +${exercise.xp_reward} XP`);
      } else {
        setIsCompleted(false); // Explicitly set to false if not all pass
        toast.info(`⚠️ Some tests failed. Score: ${result.score}%`);
      }
    } catch (err) {
      setIsCompleted(false); // Also set to false on error
      setTerminalOutput("❌ Error during evaluation");
      toast.error(err.message);
    }
  };

  const handleComplete = () => {
    if (!isCompleted) {
      toast.error("❗ Please pass all tests before completing.");
      return;
    }

    toast.success(`✅ Exercise marked as complete! +${exercise.xp_reward} XP`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-white">
        Loading exercise...
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-white">
        Exercise not found
      </div>
    );
  }

  return (
    <div className={`
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
        <div className="w-1/2 p-4 space-y-6 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{exercise.title}</h2>
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  exercise.difficulty === "Easy"
                    ? "bg-green-500"
                    : exercise.difficulty === "Medium"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {exercise.difficulty}
              </span>
              {isCompleted && (
                <span className="px-2 py-1 text-xs bg-accent text-black rounded-full">
                  +{exercise.xp_reward} XP
                </span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-accent text-lg mb-1">Description</h3>
            <p className="text-sm text-gray-300 whitespace-pre-line">
              {exercise.description}
            </p>
          </div>

          {exercise.example && (
            <div>
              <h3 className="text-accent text-lg mb-1">Example</h3>
              <p className="text-sm text-gray-300 whitespace-pre-line">
                {exercise.example}
              </p>
            </div>
          )}
        </div>

        {/* Right - Code & Terminal */}
        <div className="w-1/2 flex flex-col border-l border-accent">
          {/* Editor Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-accent">
            <h3 className="text-accent text-xl">
              Code.{exercise.language || "html"}
            </h3>
            <div className="space-x-2">
              <button
                onClick={run}
                className="bg-accent text-black px-3 py-1 rounded hover:bg-accentHover"
              >
                RUN
              </button>
              <button
                onClick={() => setBotOpen((o) => !o)} // toggle open/close bot 
                className="bg-footer text-white px-3 py-1 rounded border border-accent hover:bg-accentHover"
              >
                {botOpen ? "Close Bot" : "Ask Bot"} 
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage={exercise.language || "html"}
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
            <pre className="whitespace-pre-wrap text-sm text-green-300">
              {terminalOutput || "Click RUN to evaluate your code."}
            </pre>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center p-4 border-t border-accent">
            <button
              className="px-4 py-1 bg-footer border border-accent rounded hover:bg-accentHover"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <button
              onClick={handleComplete}
              className="px-4 py-1 bg-accent text-black rounded hover:bg-accentHover"
              disabled={isCompleted}
            >
              {isCompleted ? "Completed!" : "Complete"}
            </button>
            <button className="px-4 py-1 bg-footer border border-accent rounded hover:bg-accentHover">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ChatBot */}
      <ChatBot isOpen={botOpen} onClose={handleBotClose} />
    </div>
  );
}
