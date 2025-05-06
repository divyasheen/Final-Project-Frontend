import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './Bugadune.scss';

const STORAGE_KEY = 'bugaduneCode';
const DEFAULT_CODE = `// Oops: there's a typo below!
// Fix the function name so this runs without error.
function gret(name) {
  console.log("Hello, " + name + " of the Flame");
}
greet("Coder");`;

export default function Bugadune() {
  const [code, setCode] = useState(() =>
    localStorage.getItem(STORAGE_KEY) || DEFAULT_CODE
  );
  const [output, setOutput] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, code);
  }, [code]);

  const run = () => {
    let consoleLog = '';
    const origLog = console.log;
    console.log = msg => { consoleLog += msg + '\n'; };

    try {
      eval(code);
    } catch (e) {
      consoleLog += 'Error: ' + e.message;
    }
    console.log = origLog;
    setOutput(consoleLog);
  };

  return (
    <div className="bugadune-container">
      <h2>Bugadune</h2>
      <p>Debug this JavaScript—run below to see console output:</p>
      <Editor
        height="30vh"
        language="javascript"
        value={code}
        onChange={v => setCode(v)}
      />
      <button className="run-btn btn btn-primary" onClick={run}>
        Run
      </button>
      <pre className="console-output">
        {output}
      </pre>
    </div>
  );
}
