import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import universityImage from '../../assets/images/university.png';
import { toast } from 'react-toastify';

const UniversityIntro = () => {
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch courses and lessons
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/courses');
        if (!response.ok) throw new Error('Failed to fetch courses');
        
        const data = await response.json();
        setCourses(data);
        
        if (data.length > 0) {
          setActiveCourse(data[0].id);
          if (data[0].lessons && data[0].lessons.length > 0) {
            setActiveLesson(data[0].lessons[0].id);
          }
        }
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      } 
    };

    fetchData();
  }, []);

 // Fetch lesson content and exercises when lesson changes
useEffect(() => {
  if (!activeLesson) return;

  const fetchLessonData = async () => {
    try {
      setIsLoading(true);

      // Fetch lesson content
      const lessonRes = await fetch(`http://localhost:5000/api/courses/lessons/${activeLesson}`);
      if (!lessonRes.ok) throw new Error('Failed to fetch lesson');
      const lessonData = await lessonRes.json();
      setLessonContent(lessonData);

      // Find the course that contains this lesson
      const course = courses.find(c => 
        c.lessons && c.lessons.some(l => l.id === activeLesson)
      );

      if (course) {
        try {
          // Fetch exercises
          const exercisesRes = await fetch(
            `http://localhost:5000/api/courses/${course.id}/lessons/${activeLesson}/exercises`
          );

          if (exercisesRes.ok) {
            const exercisesData = await exercisesRes.json();
            setExercises(exercisesData);
          } else if (exercisesRes.status === 404) {
            setExercises([]); // No exercises available
          } else {
            console.warn('Unexpected error fetching exercises');
            setExercises([]);
          }
        } catch (exerciseErr) {
          console.warn('Exercise fetch error:', exerciseErr);
          setExercises([]); // On fetch error, show empty state
        }
      }

      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  fetchLessonData();
}, [activeLesson, courses]);


  if (error) return <div className="text-red-500 text-center p-8">Error: {error}</div>;
  if (isLoading) return <div className="flex items-center justify-center h-screen bg-background text-white">Loading...</div>;

  return (
    <div className="min-h-screen font-vt323 bg-background text-white">
      {/* Header */}
      <div 
        className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] mx-auto mb-6 md:mb-8 overflow-hidden"
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
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 p-4">
        {/* Left sidebar - Courses */}
        <div className="w-full lg:w-[280px] border-2 border-accent rounded-lg p-3 md:p-4 bg-gray-900/50">
          <h2 className="text-xl mb-4">Courses</h2>
          {courses.map((course) => (
            <div key={course.id} className="mb-4">
              <div 
                className={`flex justify-between items-center p-2 cursor-pointer rounded-md ${
                  activeCourse === course.id 
                    ? "bg-accent text-background" 
                    : "hover:bg-gray-700/50"
                }`}
                onClick={() => {
                  setActiveCourse(course.id);
                  if (course.lessons?.length > 0) {
                    setActiveLesson(course.lessons[0].id);
                  }
                }}
              >
                <h3 className="text-lg md:text-xl">{course.title}</h3>
                <svg
                  className={`w-4 h-4 md:w-5 md:h-5 transform transition-transform ${
                    activeCourse === course.id ? "rotate-180" : ""
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
              {activeCourse === course.id && course.lessons?.length > 0 && (
                <ul className="ml-4 mt-2 space-y-1 border-l-2 border-accent pl-3">
                  {course.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className={`p-2 text-sm cursor-pointer rounded-md ${
                        activeLesson === lesson.id
                          ? "bg-accent/20 text-accent font-medium"
                          : "hover:bg-gray-700/30"
                      }`}
                      onClick={() => setActiveLesson(lesson.id)}
                    >
                      {lesson.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Right content area */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Lesson Content */}
          <div className="border-2 border-accent rounded-lg p-4 md:p-6 bg-gray-900/50">
            {lessonContent ? (
              <div>
                <h2 className="text-2xl md:text-3xl mb-4 text-accent">
                  {lessonContent.title}
                </h2>
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: lessonContent.content.replace(/\n/g, '<br />') 
                  }}
                />
              </div>
            ) : (
              <p className="text-gray-400 italic">
                Select a lesson to view its content
              </p>
            )}
          </div>

          {/* Exercises */}
          <div className="border-2 border-accent rounded-lg p-4 md:p-6 bg-gray-900/50">
            <h3 className="text-xl md:text-2xl mb-4">Exercises</h3>
            {exercises.length > 0 ? (
              <div className="grid gap-3">
                {exercises.map((exercise) => (
                  <Link
                    to={`/university/${exercise.id}`}
                    key={exercise.id}
                    className="block p-3 border border-gray-700 rounded-lg hover:bg-gray-700/30 transition-colors no-underline"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{exercise.title}</h4>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                          {exercise.description.split('\n')[0]}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-2 py-1 text-xs rounded-full mb-1 ${
                          exercise.difficulty === 'Easy' ? 'bg-green-500' :
                          exercise.difficulty === 'Medium' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}>
                          {exercise.difficulty}
                        </span>
                        <span className="text-accent text-sm">
                          +{exercise.xp_reward} XP
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">
                No exercises available for this lesson
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityIntro;