import ProgressBar from "@ramonak/react-progress-bar";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../contexts/userIdContext";
import placeholderAvatar from "../../assets/images/placeholder_Avatar.jpg"

function ProfilNav() {
  // -*-*- Hooks: State, Navigate -*-*-
  const { userId, token } = useContext(UserContext);
  const [userProgress, setUserProgress] = useState(null);
  const [userData, setUserData] = useState(null);
  const [badges, setBadges] = useState([]);
  const [posts, setPosts] = useState([]);
  const [profileAvatar, setProfileAvatar] = useState();

  const { id } = useParams();
  // console.log("params id:", id);

  const profileId = id;
  // console.log(profileId);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        // Get token from context or localStorage
        const currentToken = token || localStorage.getItem("token");

        if (!currentToken) {
          console.error("No token available for API call");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/user/progress`,
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Progress fetch failed:", {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          });

          throw new Error(errorData.error || "Failed to fetch progress");
        }

        const data = await response.json();
        // console.log("progressData: ", data);

        setUserProgress(data);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        // Get token from context or localStorage
        const currentToken = token || localStorage.getItem("token");

        if (!currentToken) {
          console.error("No token available for API call");
          return;
        }

        // Use /me endpoint if no id is provided, otherwise use /:id endpoint
        const endpoint = userId
          ? `http://localhost:5000/api/user/${profileId}`
          : "http://localhost:5000/api/user/me";

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          console.error("User data fetch failed:", {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
            endpoint,
          });

          throw new Error(errorData.error || "Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchBadges = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/user/${profileId}/getBadges`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const badgesJsn = await response.json();
        const badgesArray = Object.values(badgesJsn);
        setBadges(badgesArray);
      } catch (error) {
        console.error("Error fetching badges: ", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/posts/userPosts/${profileId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const postsJsn = await response.json();

        console.log(postsJsn);

        setPosts(postsJsn);
      } catch (error) {
        console.error("FE - Error fetching user posts: ", error);
      }
    };

    const fetchProfileAvatar = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${profileId}/getProfilPic`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setProfileAvatar(data.image_url);

    } catch (error) {
      console.error("Error fetching profileAvatar:", error);
    }
  }

    if (profileId) {
      fetchUserProgress();
      fetchUserData();
      fetchBadges();
      fetchPosts();
      fetchProfileAvatar();
    }
  }, [profileId, token]);

  const readDateForPosts = () => {
    const readableDates = [];

    posts?.map((post) => {
      const date = new Date(post.created_at);
      const readableDate = date.toLocaleDateString("en-EN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      readableDates.push(readableDate);
    });

    return readableDates;
  };

  const readDate = () => {
    const date = new Date(userData?.created_at);
    const readableDate = date.toLocaleDateString("en-EN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return readableDate;
  };

  const joined = readDate();
  const dates = readDateForPosts();

  // console.log(dates);

  const borderButton = {
    border: "1px solid blue",
    backgroundColor: "lightblue",
    cursor: "pointer",
  };

  const styleAvatar = {
    width: "100px",
    borderRadius: "50px"
  }

  return (
    <>
      {userData ? (
        <div>

          <div>
            <img style = {styleAvatar}src={profileAvatar || placeholderAvatar} />
            <div>{userData.username}</div>
          </div>

          <div>
            <h2>Info</h2>
            <div>{userData.info > 0 ? userData.info : "Hello! Nice to meet you!"}</div>
            <div>{userData.location}</div>
            <div>Joined: {joined}</div>
            <div>{userData.social}</div>
            <button style = {borderButton} onClick={() => navigate("/edit-profile")}>
              Edit Profile
            </button>
          </div>

          <div>
            <h2>Stats</h2>
            <div>XP:</div>
            <ProgressBar maxCompleted={300} completed={userData.xp} />
            <div>Badges: {userData.badgesCount}</div>
            <div>
              {badges[0]?.map((badge, index) => (
                <div key={index}>
                  <h3>{badge.name}</h3>
                  <p>{badge.description}</p>
                </div>
              ))}
            </div>
            {/*   <div>
              {userProgress ? (
                <div>
                  Amount of Exercises: {userProgress.completedExercises}
                </div>
              ) : (
                <div>Loading exercises...</div>
              )}
            </div> */}
          </div>

          <div>
            {posts?.map((post, index) => (
              <div key={index}>
                <p>POST {index + 1}</p>
                <h3>TITEL: {post.title}</h3>
                <p>BODY: {post.body}</p>
                <p>DATE: {dates[index]}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>... Data loading ...</p>
      )}
    </>
  );
}

export default ProfilNav;
