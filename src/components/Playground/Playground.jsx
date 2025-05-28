import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import Split from "react-split";
import "tailwindcss/tailwind.css";

export default function Playground() {
  const [html, setHtml] = useState(
    () => localStorage.getItem("html") || "<p>Hello, world!</p>"
  );
  const [css, setCss] = useState(
    () => localStorage.getItem("css") || "p { color: violet; }"
  );
  const [js, setJs] = useState(
    () => localStorage.getItem("js") || 'console.log("Ready!");'
  );
  const [activeTab, setActiveTab] = useState("html");
  const [srcDoc, setSrcDoc] = useState("");
  const [logs, setLogs] = useState([]);
  const iframeRef = useRef(null);

  // Auto-save
  useEffect(() => localStorage.setItem("html", html), [html]);
  useEffect(() => localStorage.setItem("css", css), [css]);
  useEffect(() => localStorage.setItem("js", js), [js]);

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.source === "coderealm-console") {
        setLogs((prev) => [...prev, event.data.payload]);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Auto-update preview
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLogs([]); // Clear logs on code update
      const fullDoc = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Live Preview</title>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            const log = console.log;
            console.log = function(...args) {
              window.parent.postMessage({ source: 'coderealm-console', payload: args.join(' ') }, '*');
              log.apply(console, args);
            };
            try {
              ${js}
            } catch (err) {
              window.parent.postMessage({ source: 'coderealm-console', payload: 'Error: ' + err.message }, '*');
            }
          </script>
        </body>
        </html>
      `;
      setSrcDoc(fullDoc);
    }, 250);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  // Register snippets
  function registerHtmlSnippets(monaco) {
    monaco.languages.registerCompletionItemProvider("html", {
      provideCompletionItems: () => {
        const tags = [
          "div",
          "p",
          "h1",
          "h2",
          "span",
          "a",
          "img",
          "ul",
          "ol",
          "li",
          "button",
          "input",
          "form",
          "section",
          "article",
          "footer",
          "header",
          "nav",
          "main",
          "link",
        ];
        const suggestions = tags.map((tag) => ({
          label: tag,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText:
            tag === "img" || tag === "input"
              ? `<${tag} $1 />`
              : `<${tag}>$1</${tag}>`,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: `${tag} element`,
        }));
        return { suggestions };
      },
    });
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Top Bar — single row with all 3 items */}
      <div className="p-2 border-b border-gray-700 flex items-center justify-between">
        {/* Left: HTML/CSS Toggle */}
        <div className="flex items-center space-x-2 w-1/4">
          <button
            className={`px-3 py-1 rounded ${
              activeTab === "html" ? "bg-indigo-500" : "bg-gray-700"
            }`}
            onClick={() => setActiveTab("html")}
          >
            HTML
          </button>
          <button
            className={`px-3 py-1 rounded ${
              activeTab === "css" ? "bg-indigo-500" : "bg-gray-700"
            }`}
            onClick={() => setActiveTab("css")}
          >
            CSS
          </button>
        </div>

        {/* Middle: JS Label */}
        <div className="w-2/5 flex justify-center">
          <div className="px-3 py-1 bg-gray-700 rounded">JS</div>
        </div>

        {/* Right: Preview Label */}
        <div className="w-1/3 flex justify-end pr-4">
          <div className="px-3 py-1 bg-gray-700 rounded">Preview</div>
        </div>
      </div>

      {/* Split Layout */}
      <Split
        className="flex flex-1 overflow-hidden"
        sizes={[25, 40, 35]}
        minSize={100}
        gutterSize={8}
        direction="horizontal"
        cursor="col-resize"
      >
        {/* Left: HTML/CSS */}
        <div className="h-full bg-gray-800">
          <Editor
            language={activeTab}
            value={activeTab === "html" ? html : css}
            onChange={(value) => {
              if (activeTab === "html") setHtml(value || "");
              else setCss(value || "");
            }}
            theme="vs-dark"
            options={{
              tabCompletion: "on",
              quickSuggestions: true,
              fontSize: 14,
            }}
            onMount={(editor, monaco) => enableAltZToggle(editor, monaco)}
            beforeMount={(monaco) => {
              monaco.languages.html.htmlDefaults.setOptions({
                suggest: { html5: true },
              });
              monaco.languages.css.cssDefaults.setOptions({
                lint: { unknownProperties: "ignore" },
              });
              registerHtmlSnippets(monaco);
              monaco.languages.registerCompletionItemProvider("html", {
                triggerCharacters: ["!"],
                provideCompletionItems(model, position) {
                  const word = model.getWordUntilPosition(position);
                  const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn - 1,
                    endColumn: word.endColumn,
                  };
                  return {
                    suggestions: [
                      {
                        label: "!doctype",
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>\${1:Document}</title>
    <style>
      \${2:/* CSS here */}
    </style>
  </head>
  <body>
    \${3:<!-- HTML here -->}
  </body>
</html>`,
                        insertTextRules:
                          monaco.languages.CompletionItemInsertTextRule
                            .InsertAsSnippet,
                        documentation: "Full HTML5 boilerplate with doctype",
                        range,
                      },
                    ],
                  };
                },
              });
            }}
          />
        </div>

        {/* Middle: JS */}
        <div className="h-full bg-gray-800">
          <Editor
            language="javascript"
            value={js}
            onChange={(value) => setJs(value || "")}
            theme="vs-dark"
            options={{
              tabCompletion: "on",
              quickSuggestions: true,
              fontSize: 14,
            }}
          />
        </div>

        {/* Right: Preview + Console */}
        <div className="h-full flex flex-col">
          <div className="flex-3 h-3/4 bg-white">
            <iframe
              ref={iframeRef}
              title="Live Preview"
              srcDoc={srcDoc}
              sandbox="allow-scripts"
              frameBorder="0"
              className="w-full h-full"
            />
          </div>
          <div className="flex-1 h-1/4 bg-footer text-accent text-sm p-2 overflow-auto font-mono border-t border-gray-700">
            {logs.length === 0 ? (
              <p className="text-gray-500">
                Console output will appear here...
              </p>
            ) : (
              logs.map((log, i) => <div key={i}>{log}</div>)
            )}
          </div>
        </div>
      </Split>
    </div>
  );
}

// ALT + Z: Toggle Word Wrap
function enableAltZToggle(editor, monaco) {
  editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyZ, () => {
    const current = editor.getRawOptions().wordWrap;
    editor.updateOptions({ wordWrap: current === "on" ? "off" : "on" });
  });
}
