import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import universityImage from '../../assets/images/university.png';

const UniversityIntro = () => {
  const [activeChapter, setActiveChapter] = useState('Chapter 1 - HTML & CSS');
  const [activeLesson, setActiveLesson] = useState('Lesson 1');

  // Sample data structure
  const chapters = [
    {
      title: 'Chapter 1 - HTML & CSS',
      lessons: ['Lesson 1', 'Lesson 2', 'Lesson 3', 'Lesson 4']
    },
    {
      title: 'Chapter 2 - Programming Basics',
      lessons: ['Lesson 1', 'Lesson 2', 'Lesson 3', 'Lesson 4']
    },
    {
      title: 'Chapter 3 - SPA',
      lessons: ['Lesson 1', 'Lesson 2', 'Lesson 3', 'Lesson 4']
    },
    {
      title: 'Chapter 4 - Backend',
      lessons: ['Lesson 1', 'Lesson 2', 'Lesson 3', 'Lesson 4']
    }
  ];

  // Sample exercises data
  const exercises = {
    "Lesson 1": [
      { id: 1, name: "Name of Exercise 1", status: "Done" },
      { id: 2, name: "Name of Exercise 2", status: "Done" },
      { id: 3, name: "Name of Exercise 3", status: "+ 20 XP" },
      { id: 4, name: "Name of Exercise 4", status: "+ 20 XP" },
    ],
    "Lesson 2": [
      { id: 1, name: "Name of Exercise 1", status: "+ 20 XP" },
      { id: 2, name: "Name of Exercise 2", status: "+ 20 XP" },
      { id: 3, name: "Name of Exercise 3", status: "+ 20 XP" },
      { id: 4, name: "Name of Exercise 4", status: "+ 20 XP" },
    ],
    'Lesson 3': [
      { id: 1, name: 'Name of Exercise 1', status: '+ 20 XP' },
      { id: 2, name: 'Name of Exercise 2', status: '+ 20 XP' },
      { id: 3, name: 'Name of Exercise 3', status: '+ 20 XP' },
      { id: 4, name: 'Name of Exercise 4', status: '+ 20 XP' }
    ],
    'Lesson 4': [
      { id: 1, name: 'Name of Exercise 1', status: '+ 20 XP' },
      { id: 2, name: 'Name of Exercise 2', status: '+ 20 XP' },
      { id: 3, name: 'Name of Exercise 3', status: '+ 20 XP' },
      { id: 4, name: 'Name of Exercise 4', status: '+ 20 XP' }
    ]
  };

  return (
    <div className="min-h-screen font-vt323 bg-background text-white">
      {/* Header */}
      <div 
        className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] mx-auto mb-6 md:mb-8  overflow-hidden"
        style={{
          boxShadow: 'inset 0px -250px 250px 30px #0E0E1A',
          backgroundImage: `url(${universityImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-accent font-bold text-center tracking-wide">
            UNIVERSITY OF<br />TERMINALIA
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-[280px] border-2 border-accent rounded-lg p-3 md:p-4 bg-gray-900/50">
          {chapters.map((chapter) => (
            <div key={chapter.title} className="mb-2">
              {/* Chapter with dropdown button */}
              <div 
                className={`flex justify-between items-center p-2 cursor-pointer rounded-md ${
                  activeChapter === chapter.title 
                    ? "bg-accent text-background" 
                    : "hover:bg-gray-700/50"
                }`}
                onClick={() => setActiveChapter(
                  activeChapter === chapter.title ? null : chapter.title
                )}
              >
                <h3 className="text-lg md:text-xl">{chapter.title}</h3>
                <svg
                  className={`w-4 h-4 md:w-5 md:h-5 transform transition-transform ${
                    activeChapter === chapter.title ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </div>

              {/* Lessons dropdown */}
              {activeChapter === chapter.title && (
                <ul className="ml-4 mt-1 space-y-1 border-l-2 border-accent pl-3">
                  {chapter.lessons.map((lesson) => (
                    <li
                      key={lesson}
                      className={`p-2 text-sm md:text-base cursor-pointer rounded-md ${
                        activeLesson === lesson
                          ? "bg-accent/20 text-accent font-medium"
                          : "hover:bg-gray-700/30"
                      }`}
                      onClick={() => setActiveLesson(lesson)}
                    >
                      {lesson}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Exercises Content */}
        <div className="flex-1 border-2 border-accent rounded-lg p-4 md:p-6 bg-gray-900/50">
  <h3 className="text-xl md:text-2xl lg:text-3xl mb-4 md:mb-6 font-medium">
    {activeLesson}
  </h3>

  {exercises[activeLesson] && exercises[activeLesson].length > 0 ? (
    <div className="grid gap-3 sm:gap-4">
      {exercises[activeLesson].map((exercise) => (
        <Link 
          to={`/university/${exercise.id}`}
          key={exercise.id} 
          className="block p-3 md:p-4 border border-gray-700 rounded-lg hover:bg-gray-700/30 transition-colors no-underline hover:no-underline"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-gray-400 text-sm md:text-base">
                Exercise {exercise.id}
              </span>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <span className="text-sm md:text-base text-white">
                {exercise.name}
              </span>
            </div>
            <span className={`text-sm md:text-base font-medium ${
              exercise.status.includes('XP') 
                ? 'text-accent' 
                : 'text-green-500'
            }`}>
              {exercise.status}
            </span>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <p className="text-gray-400 italic">
      No exercises available for this lesson.
    </p>
  )}
</div>
      </div>
    </div>
  );
};

export default UniversityIntro;
