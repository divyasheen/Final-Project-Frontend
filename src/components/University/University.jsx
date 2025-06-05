import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useParams, useNavigate } from "react-router-dom";
import universityImage from "../../assets/images/university.png";
import { toast } from "react-toastify";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

/* ─────────────── ChatBot pane ─────────────── */
function ChatBot({ isOpen, onClose, setWidth }) {
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello 👋 – how can I help?" },
  ]);

  const send = async () => {
    if (!msg.trim()) return;

    setMessages((m) => [...m, { from: "user", text: msg.trim() }]);
    setMsg("");
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  return (
    <aside
      className={`
        fixed right-0 top-0 h-full bg-footer border-l border-accent
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        z-50 flex flex-col
      `}
      style={{ width: "500px" }}
    >
      <header className="p-3 border-b border-accent text-accent font-bold flex justify-between items-center">
        <span>Bot</span>
        <button
          onClick={onClose}
          className="text-accent text-m hover:text-white px-2 py-1"
          aria-label="Close chat"
        >
          Close
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
        <div ref={messagesEndRef} />
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
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          const startX = e.clientX;
          const startWidth = e.currentTarget.parentNode.offsetWidth;
          const sidebar = e.currentTarget.parentNode;

          const onMouseMove = (eMove) => {
            const newWidth = startWidth - (eMove.clientX - startX);
            const clamped = Math.max(300, Math.min(800, newWidth));
            sidebar.style.width = clamped + "px";
            setWidth(clamped);
          };

          const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        }}
        className="absolute left-0 top-0 h-full w-1 cursor-ew-resize bg-transparent hover:bg-accent/20"
        style={{ zIndex: 60 }}
      ></div>
    </aside>
  );
}
/* ─────────── end ChatBot pane ─────────── */

const STORAGE_KEY = "universityCode";

export default function University() {
  /* ─────────────── ChatBot pane ─────────────── */
  const [botOpen, setBotOpen] = useState(false);
  const handleBotClose = () => setBotOpen(false);
  const [botWidth, setBotWidth] = useState(500);
  /* ────────────end ChatBot pane ─────────────── */

  const { exerciseId } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [exercise, setExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  // Helper to get file extension for display - MOVED HERE!
  const getLanguageExtension = (language) => {
    switch (language) {
      case 'javascript':
        return 'js';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      default:
        return 'txt'; // Fallback for unknown languages or if language is null/undefined
    }
  };

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/courses/exercises/${exerciseId}`
        );
        if (!response.ok) throw new Error("Failed to fetch exercise");
        const data = await response.json();
        setExercise(data);

        console.log("Fetched exercise language:", data.language)

        const savedCode = localStorage.getItem(`${STORAGE_KEY}_${exerciseId}`);
        // Set default code based on language or empty string if not saved
        if (data.language === 'javascript' && !savedCode) {
            setCode('// Write your JavaScript code here\nconsole.log("Hello, world!");');
        } else if ((data.language === 'html' || data.language === 'css') && !savedCode) {
            setCode('<!DOCTYPE html>\n<html>\n<head>\n<title>My Page</title>\n<style>\n  body { font-family: sans-serif; }\n</style>\n</head>\n<body>\n  <h1>Welcome!</h1>\n</body>\n</html>');
        } else {
            setCode(savedCode || "");
        }
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
      setIsCompleted(false);
      setIsEvaluating(true);
      setTerminalOutput("Evaluating code... Please wait.\n");

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/evaluations/evaluate`,
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
        throw new Error(result.message || "Evaluation failed");
      }

      setTestResults(result.tests);

      const output = result.tests.map((test, i) => {
        let testStatus = `#${i + 1}: ${test.description || test.test_type} - ${
          test.passed ? "✅ Passed" : "❌ Failed"
        }`;
        let details = `  Status: ${test.status_description || 'N/A'}\n`;

        if (test.passed) {
          details += `  Expected: ${test.expected_output ? JSON.stringify(test.expected_output.trim()) : 'None'}\n`;
          details += `  Actual: ${test.actual ? JSON.stringify(test.actual.trim()) : 'None'}\n`;
        } else {
          if (test.error) {
            details += `  Error: ${test.error}\n`;
          }
          if (test.expected_output) {
              details += `  Expected Output: ${JSON.stringify(test.expected_output.trim())}\n`;
          }
          if (test.actual && test.actual.trim() !== '') {
              details += `  Actual Output: ${JSON.stringify(test.actual.trim())}\n`;
          }
        }

        if (exercise?.language === 'javascript') {
            if (test.time !== undefined) details += `  Time: ${test.time}s\n`;
            if (test.memory !== undefined) details += `  Memory: ${test.memory}KB\n`;
        }

        return testStatus + '\n' + details;
      }).join("\n---\n");

      setTerminalOutput(output);

      if (exercise?.language === 'html' || exercise?.language === 'css') {
        setPreviewHtml(result.htmlPreview || code);
      } else {
        setPreviewHtml("");
        setShowPreview(false);
      }


      const allTestsPassed = result.tests.every((test) => test.passed);
      if (allTestsPassed) {
        setIsCompleted(true);
        toast.success(`✅ All tests passed! Score: ${result.score}% +${exercise.xp_reward} XP`);
      } else {
        setIsCompleted(false);
        toast.info(`⚠️ Some tests failed. Score: ${result.score}%`);
      }
    } catch (err) {
      setIsCompleted(false);
      setTerminalOutput(`❌ Error during evaluation: ${err.message}`);
      toast.error(err.message);
    } finally {
      setIsEvaluating(false);
    }
  };
  const handleComplete = () => {
    const allTestsPassed = testResults.length > 0 && testResults.every(test => test.passed);

    if (!allTestsPassed) {
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
    <div
      className="relative flex flex-col h-screen bg-background text-white font-vt323 transition-all duration-100 ease-in-out"
      style={{ paddingRight: botOpen ? `${botWidth}px` : 0 }}
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
            <div className="prose prose-invert text-sm text-gray-300 max-w-none">
              <ReactMarkdown>{exercise.description}</ReactMarkdown>
            </div>
          </div>

          {exercise.example && (
            <div>
              <h3 className="text-accent text-lg mb-1">Example</h3>
              <div className="prose prose-invert text-sm text-gray-300 max-w-none">
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
                  {`\`\`\`${exercise.language}\n${exercise.example}\n\`\`\``}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Right - Code & Terminal */}
        <div className="w-1/2 flex flex-col border-l border-accent">
          {/* Editor Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-accent">
            <h3 className="text-accent text-xl">
              Code.{getLanguageExtension(exercise.language)}
            </h3>
            <div className="space-x-2">
              <button
                onClick={run}
                className="bg-accent text-black px-3 py-1 rounded hover:bg-accentHover disabled:bg-gray-600 disabled:cursor-not-allowed"
                disabled={isEvaluating}
              >
                {isEvaluating ? "RUNNING..." : "RUN"}
              </button>
              {(exercise.language === 'html' || exercise.language === 'css') && (
                <button
                  onClick={() => setShowPreview((p) => !p)}
                  className="bg-footer text-white px-3 py-1 rounded border border-accent hover:bg-accentHover"
                >
                  {showPreview ? "Hide Preview" : "Preview"}
                </button>
              )}
              <button
                onClick={() => setBotOpen((o) => !o)}
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
          {/* Live Preview (Conditional based on language) */}
          {(exercise.language === 'html' || exercise.language === 'css') && showPreview && (
            <div className="h-56 border-t border-accent bg-white overflow-auto">
              <h4 className="text-black font-bold p-2 bg-accent">
                Live Preview
              </h4>
              <iframe
                title="Preview"
                srcDoc={previewHtml}
                className="w-full h-full"
                sandbox="allow-scripts"
              />
            </div>
          )}

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
              className="px-4 py-1 bg-accent text-black rounded hover:bg-accentHover disabled:bg-gray-600 disabled:cursor-not-allowed"
              disabled={!isCompleted}
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
      <ChatBot
        isOpen={botOpen}
        onClose={handleBotClose}
        setWidth={setBotWidth}
      />
    </div>
  );
}
