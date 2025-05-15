import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import dotenv from "dotenv";

dotenv.config();



export default function Chatbot() {
    const [messages, setMessages] = useState([
        { role: "system", content: "Hello! I am your AI learning assistant." }
    ])

    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input }]
        setMessages(newMessages)
        setInput("")
        setLoading(true)

        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/chatbot`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages })
            })

            const data = await res.json()
            setMessages([...newMessages, { role: "assistant", content: data.reply }])
        
        } catch (err) {
            console.error("Error:", err)
            setMessages([ ...newMessages, 
                { role: "system", content: "Something went wrong. Please try again."}])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col max-w-xl mx-auto h-screen p-4">
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {messages.map((msg, i) => (
                    <div 
                        key={i}
                        className={`p-3 rounded-lg max-w-[75%] ${
                                msg.role === "user" 
                                ? "bg-blue-500 text-white self-end" 
                                : "bg-gray-200 text-black self-start"
                        }`}
                    >
                        <ReactMarkdown
                            children={msg.content}
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || "")
                                    const codeText = String(children).replace(/\n$/, "")

                                    return !inline && match ? (

                                        <div className="relative group">
                                            <button
                                                className="absolute top-2 right-2 text-xs bg-white/10 text-white border border-white/20 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(codeText)
                                                }}
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
                                                    fontSize: "0.9rem"
                                                }}
                                                {...props}
                                            >
                                                {codeText}
                                            </SyntaxHighlighter>
                                        </div>
                                        ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    )    
                                }
                            }} 
                        />       
                    </div>
                ))}
                    {loading && (<div className="text-gray-500">Assistant is typing...</div>)}
            </div>
            <div className="flex gap-2">
                <input 
                    className="flex-1 border rounded-xl p-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                >
                    Send
                </button>
            </div>
        </div>
    )
}