import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import './Playground.scss';

const LANG_KEY = 'playgroundLang';
const CODE_KEY = 'playgroundCode';
const DEFAULT_LANG = 'javascript';
const DEFAULT_CODE = {
  javascript: `// console.log works here!\nconsole.log("Hello, Coderealm!");`,
  html: `<!DOCTYPE html>\n<html><body>\n  <h1>HTML Preview</h1>\n  <p>Edit and Run!</p>\n</body></html>`,
  css: `body { background: #f9f5f0; }\nh1 { color: darkmagenta; }`,
  markdown: `# Hello Markdown\n\n* It renders live!\n* **Enjoy!**`,
  json: `{\n  "name": "Coderealm",\n  "quest": "Restore the balance"\n}`,
  typescript: `// TS example\nconst greet = (name: string): string => \`Hi, \${name}!\`;\nconsole.log(greet("Coder"));`
};

export default function Playground() {
  const [lang, setLang] = useState(
    () => localStorage.getItem(LANG_KEY) || DEFAULT_LANG
  );
  const [code, setCode] = useState(
    () => localStorage.getItem(CODE_KEY) || DEFAULT_CODE[lang]
  );
  const [output, setOutput] = useState('');
  const [srcDoc, setSrcDoc] = useState('');

  // Persist lang & code
  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    // when language changes, reset code to default for that lang if there's nothing saved
    const saved = localStorage.getItem(CODE_KEY + '_' + lang);
    if (saved) {
      setCode(saved);
    } else {
      setCode(DEFAULT_CODE[lang]);
    }
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(CODE_KEY + '_' + lang, code);
  }, [code, lang]);

  const run = () => {
    setOutput('');    // clear previous
    setSrcDoc('');    // clear previous

    if (lang === 'html') {
      setSrcDoc(code);
    } else if (lang === 'css') {
      // wrap CSS in HTML template
      setSrcDoc(`
        <html>
          <head><style>${code}</style></head>
          <body>
            <h1>CSS Preview</h1>
            <p>Edit and run to style me.</p>
          </body>
        </html>
      `);
    } else if (lang === 'javascript' || lang === 'typescript') {
      let consoleLog = '';
      const origLog = console.log;
      console.log = msg => { consoleLog += msg + '\n'; };

      try {
        eval(code);
      } catch (err) {
        consoleLog += 'Error: ' + err.message;
      }
      console.log = origLog;
      setOutput(consoleLog);
    } else if (lang === 'markdown') {
      // no action needed; we'll render via ReactMarkdown
    } else if (lang === 'json') {
      try {
        const obj = JSON.parse(code);
        setOutput(JSON.stringify(obj, null, 2));
      } catch (err) {
        setOutput('JSON Error: ' + err.message);
      }
    }
  };

  return (
    <div className="playground-container">
      <h2>Playground of Origin</h2>
      <div className="controls mb-2">
        <select
          className="form-select form-select-sm w-auto d-inline-block"
          value={lang}
          onChange={e => setLang(e.target.value)}
        >
          {Object.keys(DEFAULT_CODE).map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <button className="btn btn-primary btn-sm ms-2" onClick={run}>
          Run
        </button>
      </div>

      <Editor
        height="50vh"
        language={lang}
        value={code}
        onChange={v => setCode(v || '')}
      />

      <div className="preview-area mt-3">
        {lang === 'html' || lang === 'css' ? (
          <iframe
            title="preview"
            sandbox="allow-scripts"
            srcDoc={srcDoc}
            className="preview-iframe"
          />
        ) : lang === 'javascript' || lang === 'typescript' || lang === 'json' ? (
          <pre className="console-output">{output}</pre>
        ) : lang === 'markdown' ? (
          <div className="markdown-output">
            <ReactMarkdown>{code}</ReactMarkdown>
          </div>
        ) : null}
      </div>
    </div>
  );
}
