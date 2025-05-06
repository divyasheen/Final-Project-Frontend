import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './TowerOfAPIon.scss';

const STORAGE_KEY = 'towerofapionCode';
const DEFAULT_CODE = `// Fetch a post from JSONPlaceholder
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(console.error);`;

export default function TowerOfAPIon() {
  const [code, setCode] = useState(() =>
    localStorage.getItem(STORAGE_KEY) || DEFAULT_CODE
  );
  const [output, setOutput] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, code);
  }, [code]);

  const run = () => {
    setOutput('Loading…');
    let log = '';
    const origLog = console.log;
    console.log = msg => { log += JSON.stringify(msg, null, 2) + '\n'; };

    (async () => {
      try {
        await eval(`(async () => { ${code} })()`);
        setOutput(log);
      } catch (err) {
        setOutput('Error: ' + err.message);
      } finally {
        console.log = origLog;
      }
    })();
  };

  return (
    <div className="tower-container">
      <h2>Tower of APIon</h2>
      <p>Write a fetch/REST quest here:</p>
      <Editor
        height="25vh"
        language="javascript"
        value={code}
        onChange={v => setCode(v)}
      />
      <button className="run-btn btn btn-primary" onClick={run}>
        Run
      </button>
      <pre className="api-output">{output}</pre>
    </div>
  );
}
