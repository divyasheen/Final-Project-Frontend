import ProgressBar from "@ramonak/react-progress-bar";
import { useState, useEffect, use, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import EditProfile from "../EditProfile";
import { UserContext } from "../../contexts/userIdContext";

function ProfilNav() {
  // ------------ JB: PLACEHOLDER TILL FETCHING WORKS -----------------
  const badges = ["HTML-Badge", "CSS-Badge", "JS-Badge"];

  // -*-*- Hooks: State, Navigate -*-*-
  const [userData, setUserData] = useState();
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();

  // -*-*- onClick -*-*-

  // -*-*- Loading User -*-*_
  useEffect(() => {
    // JB: We fetch one time (because of the dependency [id] of the useEffect) the user and store it inside useData
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/user/${userId}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <>
      {userData ? (
        <div>
          <h1>ProfileUser</h1>
          <div>
            <img src="https://placekeanu.com/100/100" />
            <div>{userData.username}</div>
          </div>

          <div>
            <h2>Info</h2>
            <div>Individual text about you</div>
            <div>Location - from BE</div>
            <div>Joined: {userData.created_at}</div>
            <div>List of linked Profiles (Insta, Github)</div>
            <div>Skills/Languages - from BE</div>
            <button onClick={() => navigate("/edit-profile")}>
              Edit Profile
            </button>
          </div>

          <div>
            <h2>Stats</h2>
            <div>XP:</div>
            <ProgressBar completed={userData.xp} />
            <div>Badges - from BE</div>
            <div>Amount of Exercises - from BE</div>
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
