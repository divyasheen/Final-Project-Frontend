import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import universityImage from "../../assets/images/university.png";
import { UserContext } from "../../contexts/userIdContext";

const UniversityIntro = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [courseExercises, setCourseExercises] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);
  const [lessonCompletion, setLessonCompletion] = useState({});

  // Fetch courses and lessons
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/courses`
        );
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data);

        // Set initial state from navigation or first course
        const navState = location.state || {};
        const initialCourse = navState.activeCourse || data[0]?.id || null;
        setActiveCourse(initialCourse);

        if (navState.activeLesson) {
          setActiveLesson(navState.activeLesson);
        } else if (data[0]?.lessons?.[0]?.id) {
          setActiveLesson(data[0].lessons[0].id);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCourses();
  }, [location.state]);

  // Handle navigation state updates
  useEffect(() => {
    if (location.state) {
      if (location.state.activeCourse) {
        setActiveCourse(location.state.activeCourse);
      }
      if (location.state.activeLesson) {
        setActiveLesson(location.state.activeLesson);
      }
    }
  }, [location.state]);

  // Fetch all exercises for the active course
  useEffect(() => {
    if (!activeCourse || !user?.id) return;

    const fetchCourseExercises = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/courses/${activeCourse}/exercises`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch course exercises");
        const data = await response.json();
        setCourseExercises(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCourseExercises();
  }, [activeCourse, user?.id]);

  // Add this useEffect to handle lesson IDs properly
  useEffect(() => {
    if (
      activeLesson &&
      typeof activeLesson !== "number" &&
      typeof activeLesson !== "string"
    ) {
      console.error("Invalid activeLesson type:", activeLesson);
      setActiveLesson(null);
    }
  }, [activeLesson]);

  // Fetch lesson content and check exercise completion
  useEffect(() => {
    if (
      !activeLesson ||
      (typeof activeLesson !== "number" && typeof activeLesson !== "string")
    ) {
      return;
    }

    const fetchLessonData = async () => {
      try {
        // Fetch lesson content
        const lessonRes = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/courses/lessons/${activeLesson}`
        );
        if (!lessonRes.ok) throw new Error("Failed to fetch lesson");
        const lessonData = await lessonRes.json();
        setLessonContent(lessonData);

        // Find the current lesson's exercise
        const currentExercise = courseExercises.find(
          (ex) => ex.lesson_id === parseInt(activeLesson)
        );

        if (!currentExercise) {
          setExercises([]);
          return;
        }

        // Fetch progress for this exercise
        const progressRes = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/courses/lessons/${activeLesson}/progress`,
          {
            credentials: "include",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        let exerciseWithProgress = {
          ...currentExercise,
          completed: false,
        };

        if (progressRes.ok) {
          const progressData = await progressRes.json();
          if (progressData.length > 0) {
            exerciseWithProgress.completed = Boolean(
              progressData[0].is_completed
            );
          }
        }

        // Find position in course sequence
        const exerciseIndex = courseExercises.findIndex(
          (ex) => ex.id === currentExercise.id
        );

        // Determine unlock status
        const isFirstExercise = exerciseIndex === 0;
        let isUnlocked = isFirstExercise;

        if (!isFirstExercise) {
          // Check all previous exercises
          const previousExercises = courseExercises.slice(0, exerciseIndex);
          isUnlocked = previousExercises.every((ex) => ex.completed);
        }

        setExercises([
          {
            ...exerciseWithProgress,
            isUnlocked,
            isFirst: isFirstExercise,
          },
        ]);

        // Update completion status
        setLessonCompletion({
          [activeLesson]: {
            completed: exerciseWithProgress.completed ? 1 : 0,
            total: 1,
            allDone: exerciseWithProgress.completed,
          },
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLessonData();
  }, [activeLesson, courseExercises, user?.id]);

  // Handle course change
  const handleCourseChange = (courseId) => {
    setActiveCourse(courseId);
    const course = courses.find((c) => c.id === courseId);
    if (course?.lessons?.[0]?.id) {
      setActiveLesson(course.lessons[0].id);
    }
  };

  if (error) {
    return <div className="text-red-500 text-center p-8">Error: {error}</div>;
  }

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
                    ? "bg-primary text-background"
                    : "hover:bg-gray-700/50"
                }`}
                onClick={() => handleCourseChange(course.id)}
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
                          ? "bg-secondary/20 text-accent font-medium"
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
                {lessonContent.example && (
                  <div>
                    <h3 className="text-accent text-lg mb-1">Example</h3>
                    <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto">
                      <code className="text-sm text-gray-300">
                        {lessonContent.example}
                      </code>
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-400 italic">
                Select a lesson to view its content
              </p>
            )}
          </div>

          {/* Exercises */}
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
                  <div
                    key={exercise.id}
                    className={`p-3 border rounded-lg transition-colors ${
                      !exercise.isUnlocked
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    } ${
                      exercise.completed
                        ? "border-green-500 bg-green-500/10"
                        : exercise.isUnlocked
                        ? "border-gray-700 hover:bg-gray-700/30 cursor-pointer"
                        : "border-gray-800"
                    }`}
                    onClick={() => {
                      if (exercise.isUnlocked) {
                        navigate(`/university/${exercise.id}`, {
                          state: {
                            activeCourse,
                            activeLesson,
                          },
                        });
                      }
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-400">
                          Exercise {exercise.id}
                        </span>
                        <span className="mx-2 text-gray-600">|</span>
                        <span>{exercise.title}</span>
                        {!exercise.isUnlocked && !exercise.isFirst && (
                          <span className="ml-2 text-yellow-500 text-sm">
                            (Complete previous exercise to unlock)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-accent mr-2">
                          +{exercise.xp_reward} XP
                        </span>
                        {exercise.completed && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
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
