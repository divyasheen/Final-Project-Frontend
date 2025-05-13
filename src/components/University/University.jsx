import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './University.scss';
import { useParams } from 'react-router-dom';

const STORAGE_KEY = 'universityCode';
const DEFAULT_CODE = `<!DOCTYPE html>
<html>
<head>
  <title>My First HTML Hut</title>
</head>
<body>
  <h1> University Village </h1>
  <p>Build your first HTML hut here.</p>
</body>
</html>`;

export default function University() {
  const { exerciseId } = useParams();
  const [code, setCode] = useState(() =>
    localStorage.getItem(STORAGE_KEY) || DEFAULT_CODE
  );
  const [srcDoc, setSrcDoc] = useState('');

  // save to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, code);
  }, [code]);

  const run = () => setSrcDoc(code);

  return (
    <div className="university-container">
      <h2>University</h2>
      <p>Write some HTML, then click Run to see it :</p>
      <Editor
        height="40vh"
        defaultLanguage="html"
        value={code}
        onChange={v => setCode(v)}
      />
      <button className="run-btn btn btn-primary" onClick={run}>
        Run
      </button>
      <iframe
        className="preview"
        srcDoc={srcDoc}
        sandbox="allow-scripts"
      />
    </div>
  );
}