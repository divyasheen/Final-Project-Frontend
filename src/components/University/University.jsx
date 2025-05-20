import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import universityImage from '../../assets/images/university.png';

import Chatbot from '../Chatbot/Chatbot';

const STORAGE_KEY = 'universityCode';
const DEFAULT_CODE = `<!DOCTYPE html>
<html>
<head>
  <title>My First HTML Hut</title>
</head>
<body>
  <h1>University Village</h1>
  <p>Build your first HTML hut here.</p>
</body>
</html>`;

export default function University() {
  const { exerciseId } = useParams();
  const [code, setCode] = useState(() => localStorage.getItem(STORAGE_KEY) || DEFAULT_CODE);
  const [srcDoc, setSrcDoc] = useState('');
  const [botOpen, setBotOpen] = useState(false); // open/close bot

  const run = () => setSrcDoc(code);

  return (
    <div className="relative flex flex-col h-screen bg-background text-white font-vt323">
      {/* Header */}
      <header
        className="relative w-full h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${universityImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-5xl text-accent font-bold">UNIVERSITY OF TERMINALIA</h1>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden p-2 rounded-md border border-accent m-4">
        {/* Left - Content */}
        <div className="w-1/2 p-4 space-y-6">
          <h2 className="text-2xl font-semibold">Name of exercise</h2>

          <div>
            <h3 className="text-accent text-lg mb-1">Topic</h3>
            <p className="text-sm text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
              Ettam eros erot, interdum vitae viverra sed, congue eu urna.
            </p>
            <div className="bg-footer text-white p-3 mt-2 rounded text-sm">
              <strong className="text-white">
                &lt;Lot’s of informations which will explain the topic.&gt;
              </strong>
              <br />
              Like what are loops. How they work, how to code them
            </div>
          </div>

          <div>
            <h3 className="text-accent text-lg mb-1">Instruction</h3>
            <p className="text-sm text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
              Ettam eros erot, interdum vitae viverra sed, congue eu urna.
            </p>
          </div>

          <div>
            <h3 className="text-accent text-lg mb-1">Example</h3>
            <p className="text-sm text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
              Ettam eros erot, interdum vitae viverra sed, congue eu urna.
            </p>
          </div>
        </div>

        {/* Right - Code & Terminal */}
        <div className="w-1/2 flex flex-col border-l border-accent">
          {/* Editor Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-accent">
            <h3 className="text-accent text-xl">Code.js</h3>
            <div className="space-x-2">
              <button
                onClick={run}
                className="bg-accent text-black px-3 py-1 rounded hover:bg-accentHover"
              >
                RUN
              </button>
              <button
                onClick={() => setBotOpen(o => !o)} // toggles open and close
                className="bg-footer text-white px-3 py-1 rounded border border-accent hover:bg-accentHover"
              >
                {botOpen ? 'Close Bot' : 'Ask Bot'}
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="html"
              value={code}
              onChange={v => setCode(v || '')}
              options={{
                minimap: { enabled: false },
                theme: 'vs-dark',
                fontSize: 14,
                fontFamily: 'VT323',
              }}
            />
          </div>

          {/* Terminal */}
          <div className="h-56 border-t border-accent p-2 bg-black text-white text-sm overflow-auto">
            <h4 className="mb-1 text-accent">Terminal</h4>
            {srcDoc ? (
              <iframe
                srcDoc={srcDoc}
                sandbox="allow-scripts"
                className="w-full h-full bg-white"
                title="Preview"
              />
            ) : (
              <div className="text-gray-400">
                Output will appear here after clicking RUN.
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center p-4 border-t border-accent">
            <button className="px-4 py-1 bg-footer border border-accent rounded hover:bg-accentHover">
              Previous
            </button>
            <button
              onClick={run}
              className="px-4 py-1 bg-accent text-black rounded hover:bg-accentHover"
            >
              Complete
            </button>
            <button className="px-4 py-1 bg-footer border border-accent rounded hover:bg-accentHover">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Chatbot sliding panel - NO changes inside Chatbot component */}
      <div
        className={`fixed top-0 right-0 h-full bg-footer border-l border-accent z-50 transition-all duration-300 ease-in-out
          ${botOpen ? 'translate-x-0 w-1/3 opacity-100' : 'translate-x-full w-0 opacity-0 pointer-events-none'}`}
      >
        <Chatbot isOpen={botOpen} />
      </div>

    </div>
  );
}
