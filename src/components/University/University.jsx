import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useParams, useNavigate } from 'react-router-dom';
import universityImage from '../../assets/images/university.png';
import { toast } from 'react-toastify';

const STORAGE_KEY = 'universityCode';

export default function University() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [srcDoc, setSrcDoc] = useState('');
  const [exercise, setExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setIsLoading(true);
       // Fetch exercise data
        const response = await fetch(`http://localhost:5000/api/courses/exercises/${exerciseId}`);
        if (!response.ok) throw new Error('Failed to fetch exercise');
        
        const data = await response.json();
        setExercise(data);
        
        // Try to load saved code or use empty string if none exists
        const savedCode = localStorage.getItem(`${STORAGE_KEY}_${exerciseId}`);
        setCode(savedCode || '');
        
        setIsLoading(false);
      } catch (err) {
        toast.error(err.message);
        navigate('/university');
      }
    };

    fetchExercise();
  }, [exerciseId, navigate]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_${exerciseId}`, code);
  }, [code, exerciseId]);

  const run = () => setSrcDoc(code);

  const handleComplete = async () => {
    try {
      // Here you would typically verify the code against the exercise requirements
      // For now, we'll just mark it as completed
      setIsCompleted(true);
      
      // In a real app, you would send the completed exercise to the backend
      // await fetch('/api/complete-exercise', {
      //   method: 'POST',
      //   body: JSON.stringify({ exerciseId, code }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      toast.success(`Exercise completed! +${exercise.xp_reward} XP earned`);
    } catch (err) {
      toast.error('Failed to complete exercise');
    }
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
    <div className="flex flex-col h-screen bg-background text-white font-vt323">
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
        <div className="w-1/2 p-4 space-y-6 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{exercise.title}</h2>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                exercise.difficulty === 'Easy' ? 'bg-green-500' :
                exercise.difficulty === 'Medium' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}>
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
            <h3 className="text-accent text-xl">Code.js</h3>
            <div className="space-x-2">
              <button 
                onClick={run} 
                className="bg-accent text-black px-3 py-1 rounded hover:bg-accentHover"
              >
                RUN
              </button>
              <button className="bg-footer text-white px-3 py-1 rounded border border-accent hover:bg-accentHover">
                Ask Bot
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
              <div className="text-gray-400">Output will appear here after clicking RUN.</div>
            )}
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
              {isCompleted ? 'Completed!' : 'Complete'}
            </button>
            <button className="px-4 py-1 bg-footer border border-accent rounded hover:bg-accentHover">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}