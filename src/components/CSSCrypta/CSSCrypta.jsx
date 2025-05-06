import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './CSSCrypta.scss';

const STORAGE_KEY = 'csscryptaCode';
const DEFAULT_CSS = `/* Restore the temple's style! */
.crypta {
  text-align: center;
  margin-top: 2rem;
}
.crypta h1 {
  color: darkmagenta;
}
.crypta button {
  background: gold;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}`;

export default function CSSCrypta() {
  const [css, setCss] = useState(() =>
    localStorage.getItem(STORAGE_KEY) || DEFAULT_CSS
  );
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, css);
  }, [css]);

  const run = () => {
    const html = `
      <div class="crypta">
        <h1> CSS Crypta</h1>
        <button>Unlock Styles</button>
      </div>`;
    setSrcDoc(`
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>${html}</body>
      </html>`);
  };

  return (
    <div className="csscrypta-container">
      <h2>CSS Crypta</h2>
      <p>Write CSS to restore the abandoned temple:</p>
      <Editor
        height="35vh"
        language="css"
        value={css}
        onChange={v => setCss(v)}
      />
      <button className="run-btn btn btn-primary" onClick={run}>
        Run
      </button>
      <iframe className="preview" srcDoc={srcDoc} sandbox="allow-scripts" />
    </div>
  );
}
