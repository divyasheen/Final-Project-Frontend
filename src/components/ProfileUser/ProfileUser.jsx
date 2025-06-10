import ProgressBar from "@ramonak/react-progress-bar";
import { useState, useEffect, use, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/userIdContext";

function ProfilNav() {
  // -*-*- Hooks: State, Navigate -*-*-
  const { userId, avatar, userData, userProgress } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      {userData ? (
        <div>
          <h1>ProfileUser</h1>
          <div>
            <img src={avatar} />
            <div>{userData.username}</div>
          </div>

          <div>
            <h2>Info</h2>
            <div>{userData.info}</div>
            <div>{userData.location}</div>
            <div>Joined: {userData.created_at}</div>
            <div>{userData.social}</div>
            <div>Skills/Languages - from BE</div>
            <button onClick={() => navigate("/edit-profile")}>
              Edit Profile
            </button>
          </div>

          <div>
            <h2>Stats</h2>
            <div>XP:</div>
            <ProgressBar completed={userData.xp} />
            <div>Badges: {userData.badgesCount}</div>
            <div>
              {userProgress ? (
                <div>
                  Amount of Exercises: {userProgress.completedExercises}
                </div>
              ) : (
                <div>Loading exercises...</div>
              )}
            </div>
            <div>Daily strikes - from BE</div>
          </div>

          <div>
            <div>Post 1</div>
            <div>Post 2</div>
            <div>Post 3</div>
            <div>Post 4</div>
          </div>
        </div>
      ) : (
        <p>No exercises available for this lesson</p>
      )}
    </>
  );
}

export default ProfilNav;
