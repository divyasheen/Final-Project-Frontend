import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import universityImage from "../../assets/images/university.png";

const UniversityIntro = () => {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [lessonCompletion, setLessonCompletion] = useState({});

  // Fetch courses and lessons
  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/courses");
      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      setCourses(data);

      // Check navigation state for active course/lesson
      const navState = location.state || {};
      const initialCourse = navState.activeCourse || (data[0]?.id || null);
      const initialLesson = navState.activeLesson || 
                         (data[0]?.lessons?.[0]?.id || null);

      setActiveCourse(initialCourse);
      if (initialLesson) {
        setActiveLesson(initialLesson);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  fetchData();
}, [location.state]); // Add location.state as dependency

  // Fetch lesson content and exercises when lesson changes
  useEffect(() => {
    if (!activeLesson) return;

    const fetchLessonData = async () => {
      try {
        // Fetch lesson content first
        const lessonRes = await fetch(
          `http://localhost:5000/api/courses/lessons/${activeLesson}`
        );
        if (!lessonRes.ok) throw new Error("Failed to fetch lesson");
        const lessonData = await lessonRes.json();
        setLessonContent(lessonData);

        // Find the course that contains this lesson
        const course = courses.find(
          (c) => c.lessons && c.lessons.some((l) => l.id === activeLesson)
        );

        if (!course) return;

        // Fetch exercises for this lesson
        const exercisesRes = await fetch(
          `http://localhost:5000/api/courses/${course.id}/lessons/${activeLesson}/exercises`
        );
        if (!exercisesRes.ok) throw new Error("Failed to fetch exercises");
        let exercisesData = await exercisesRes.json();

        // Fetch progress for this lesson
        const progressRes = await fetch(
          `http://localhost:5000/api/courses/lessons/${activeLesson}/progress`,
          { credentials: "include" }
        );
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          console.log("Progress Data:", progressData); // Debug log

          // Convert is_completed (1/0) to boolean
          exercisesData = exercisesData.map((exercise) => {
            const progress = progressData.find((p) => p.id === exercise.id);
            return {
              ...exercise,
              completed: progress ? Boolean(progress.is_completed) : false,
            };
          });

          const completedExercises = exercisesData.filter(
            (e) => e.completed
          ).length;

          setLessonCompletion((prev) => ({
            ...prev,
            [activeLesson]: {
              completed: completedExercises,
              total: exercisesData.length,
              allDone: completedExercises === exercisesData.length,
            },
          }));
        }
        setExercises(exercisesData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLessonData();
  }, [activeLesson, courses]);

  if (error)
    return <div className="text-red-500 text-center p-8">Error: {error}</div>;

  return (
    <div className="min-h-screen font-poppins bg-background text-white">
      {/* Header */}
      <div
        className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] mx-auto mb-6 md:mb-8 overflow-hidden"
        style={{
          boxShadow: "inset 0px -250px 250px 30px #0E0E1A",
          backgroundImage: `url(${universityImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-accent font-bold text-center tracking-wide">
            UNIVERSITY OF
            <br />
            TERMINALIA
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
                  if (course.lessons && course.lessons.length > 0) {
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
              {activeCourse === course.id && course.lessons && (
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
          <div className="border-2 border-accent rounded-lg p-4 md:p-6 bg-gray-900/50 relative">
            {lessonContent ? (
              <>
                {/* Add completion badge */}
                {lessonCompletion[activeLesson]?.allDone && (
                  <div className="absolute top-4 right-4 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    COMPLETED
                  </div>
                )}
                <div>
                  <h2 className="text-2xl md:text-3xl mb-4 text-accent">
                    {lessonContent.title}
                  </h2>
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: lessonContent.content.replace(/\n/g, "<br />"),
                    }}
                  />
                </div>
                <div>
                  {lessonContent.example && (
                    <div>
                      <h3 className="text-accent text-lg mb-1">Example</h3>
                      <code className="text-sm text-gray-300 whitespace-pre-line">
                        <pre>{lessonContent.example}</pre>
                      </code>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-400 italic">
                Select a lesson to view its content
              </p>
            )}
          </div>

          {/* Exercises - Enhanced with progress indicator */}
          <div className="border-2 border-accent rounded-lg p-4 md:p-6 bg-gray-900/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl md:text-2xl">Exercises</h3>
              {lessonCompletion[activeLesson] && (
                <div className="text-sm text-gray-400">
                  {lessonCompletion[activeLesson].completed}/
                  {lessonCompletion[activeLesson].total} completed
                  {lessonCompletion[activeLesson].allDone && (
                    <span className="ml-2 text-green-500">✓</span>
                  )}
                </div>
              )}
            </div>
            {exercises.length > 0 ? (
              <div className="grid gap-3">
                {exercises.map((exercise) => (
                  <Link
                    to={`/university/${exercise.id}`}
                    key={exercise.id}
                    className={`block p-3 border rounded-lg transition-colors no-underline ${
                      exercise.completed
                        ? "border-green-500 bg-green-500/10"
                        : "border-gray-700 hover:bg-gray-700/30"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-400">
                          Exercise {exercise.id}
                        </span>
                        <span className="mx-2 text-gray-600">|</span>
                        <span>{exercise.title}</span>
                      </div>
                      <span className="text-accent">
                        +{exercise.xp_reward} XP
                      </span>
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
