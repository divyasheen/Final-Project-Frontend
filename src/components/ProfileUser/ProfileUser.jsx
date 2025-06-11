import ProgressBar from "@ramonak/react-progress-bar";
import { useState, useEffect, use, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/userIdContext";

function ProfilNav() {
  // -*-*- Hooks: State, Navigate -*-*-
  const { userId, avatar, token} = useContext(UserContext);
  const [userProgress, setUserProgress] = useState(null);
  const [userData, setUserData] = useState(null); 

  const navigate = useNavigate();
 
   useEffect(() => {
     const fetchUserProgress = async () => {
       try {
         // Get token from context or localStorage
         const currentToken = token || localStorage.getItem('token');
         if (!currentToken) {
           console.error('No token available for API call');
           return;
         }
 
         const response = await fetch(
           `http://localhost:5000/api/user/progress`,
           {
             headers: {
               'Authorization': `Bearer ${currentToken}`,
               'Content-Type': 'application/json'
             },
             credentials: 'include'
           }
         );
 
         if (!response.ok) {
           const errorData = await response.json().catch(() => ({}));
           console.error('Progress fetch failed:', {
             status: response.status,
             statusText: response.statusText,
             error: errorData
           });
           throw new Error(errorData.error || 'Failed to fetch progress');
         }
 
         const data = await response.json();
         setUserProgress(data);
       } catch (error) {
         console.error("Error fetching progress:", error);
       }
     };
 
     const fetchUserData = async () => {
       try {
         // Get token from context or localStorage
         const currentToken = token || localStorage.getItem('token');
         if (!currentToken) {
           console.error('No token available for API call');
           return;
         }
 
         // Use /me endpoint if no id is provided, otherwise use /:id endpoint
         const endpoint = userId ? `http://localhost:5000/api/user/${userId}` : 'http://localhost:5000/api/user/me';
         
         const response = await fetch(
           endpoint,
           {
             headers: {
               'Authorization': `Bearer ${currentToken}`,
               'Content-Type': 'application/json'
             },
             credentials: 'include'
           }
         );

         if (!response.ok) {
           const errorData = await response.json().catch(() => ({}));
           console.error('User data fetch failed:', {
             status: response.status,
             statusText: response.statusText,
             error: errorData,
             endpoint
           });
           throw new Error(errorData.error || 'Failed to fetch user data');
         }
 
         const data = await response.json();
         setUserData(data);
       } catch (error) {
         console.error("Error fetching user data:", error);
       }
     };
 
     if (userId) {
       fetchUserProgress();
       fetchUserData();
     }
   }, [userId, token]);

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
