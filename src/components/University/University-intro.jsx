import React, { useState } from 'react';
import './University-intro.scss';
import { Link } from 'react-router-dom';
import universityImage from '../../assets/images/university.png'; // Make sure to have this image in your assets

const UniversityIntro = () => {
  const [activeChapter, setActiveChapter] = useState('Chapter 1 - HTML');
  const [activeLesson, setActiveLesson] = useState('Lesson 1');

  // Sample data structure
  const chapters = [
    {
      title: 'Chapter 1 - HTML',
      lessons: ['Lesson 1', 'Lesson 2', 'Lesson 3', 'Lesson 4']
    },
    {
      title: 'Chapter 2 - CSS',
      lessons: ['Lesson 1', 'Lesson 2', 'Lesson 3', 'Lesson 4']
    },
    {
      title: 'Chapter 3 - JavaScript',
      lessons: []
    },
    {
      title: 'Chapter 4 - Backend',
      lessons: []
    }
  ];

  // Sample exercises data
  const exercises = {
    'Lesson 1': [
      { id: 1, name: 'Name of Exercise 1', status: 'Done' },
      { id: 2, name: 'Name of Exercise 2', status: 'Done' },
      { id: 3, name: 'Name of Exercise 3', status: '+ 20 XP' },
      { id: 4, name: 'Name of Exercise 4', status: '+ 20 XP' }
    ],
    'Lesson 2': [
      { id: 1, name: 'Name of Exercise 1', status: '+ 20 XP' },
      { id: 2, name: 'Name of Exercise 2', status: '+ 20 XP' },
      { id: 3, name: 'Name of Exercise 3', status: '+ 20 XP' },
      { id: 4, name: 'Name of Exercise 4', status: '+ 20 XP' }
    ],
    'Lesson 3': [],
    'Lesson 4': []
  };

  return (
    <div className="university">
      <div className="university__header">
        <img
          src={universityImage}
          alt="University of Terminalia"
          className="university__logo"
        />
        <h1 className="university__title">UNIVERSITY OF TERMINALIA</h1>
      </div>

      <div className="university__content">
        {/* Left sidebar with chapters and lessons */}
        <div className="university__sidebar">
          {chapters.map((chapter) => (
            <div key={chapter.title} className="chapter">
              <h3
                className={`chapter__title ${
                  activeChapter === chapter.title
                    ? "chapter__title--active"
                    : ""
                }`}
                onClick={() => setActiveChapter(chapter.title)}
              >
                {chapter.title}
              </h3>

              {activeChapter === chapter.title && (
                <ul className="lesson-list">
                  {chapter.lessons.map((lesson) => (
                    <li
                      key={lesson}
                      className={`lesson-list__item ${
                        activeLesson === lesson
                          ? "lesson-list__item--active"
                          : ""
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

        {/* Right content area with exercises */}
        <div className="university__main">
          <h2 className="university__chapter-title">{activeChapter}</h2>
          <h3 className="university__lesson-title">{activeLesson}</h3>

          {exercises[activeLesson] && exercises[activeLesson].length > 0 ? (
            <table className="exercises-table">
            <thead className="exercises-table__header">
              <tr className="exercises-table__row">
                <th className="exercises-table__cell">Exercise</th>
                <th className="exercises-table__cell">Name of Exercise</th>
                <th className="exercises-table__cell">Status</th>
              </tr>
            </thead>
            <tbody className="exercises-table__body">
              {exercises[activeLesson].map((exercise) => (
                <tr key={exercise.id} className="exercises-table__row">
                  <td className="exercises-table__cell">
                    <Link to={`/university/${exercise.id}`} className="exercise-link">
                      Exercise {exercise.id}
                    </Link>
                  </td>
                  <td className="exercises-table__cell">{exercise.name}</td>
                  <td
                    className={`exercises-table__cell exercises-table__cell--status ${
                      exercise.status.includes('XP') ? 'exercises-table__cell--xp' : ''
                    }`}
                  >
                    <Link to={`/university/${exercise.id}`} className="exercise-link">
                      {exercise.status}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          ) : (
            <p className="university__empty-message">
              No exercises available for this lesson.
            </p>
          )}

          {activeLesson === "Lesson 4" && (
            <button className="university__edit-button">Ask to edit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityIntro;