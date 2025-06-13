import React, { useState, useEffect, useContext } from "react";
import "./LandingPageUser.scss";
import Frame3 from "../../assets/images/Frame3.png";
import LandingPageUserCards from "./LandingPageUserCards";
import LandingPageUserCardsImage from "../../assets/images/LandingPageUserBackGround.jpg";
import { useParams } from "react-router-dom";
import { UserContext } from "../../contexts/userIdContext";

const LandingPageUser = () => {
  // JB: !!!IMPORTANT!!!! Do NOT change this. Here we create the userId context which we can use everywhere! AND I really hope everywhere is a global >.<
  const {
    setUserId,
    token,
    avatar,
    userProgress,
    userData,
    setUserProgress,
    setUserData,
    setAvatar,
  } = useContext(UserContext);

  const {} = useContext(UserContext);

  //we need to find the user who has the id of the param and render the user details
  const { id } = useParams();

  // Move setUserId into useEffect
  useEffect(() => {
    if (id) {
      setUserId(id);
    }
  }, [id, setUserId]);

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
        const endpoint = id
          ? `http://localhost:5000/api/user/${id}`
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

    const fetchAvatar = async () => {
      try {

        const currentToken = token || localStorage.getItem("token");
        if (!currentToken) {
          console.error("No token available for API call");
          return;
        }

        const res = await fetch(
          `http://localhost:5000/api/user/${id}/getProfilPic`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch avatar at LPU!");
        }

        const data = await res.json();
        const imageUrl = data.image_url;

        // console.log(data);
        // console.log(imageUrl);

        setAvatar(imageUrl);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    useEffect(() => {
    if (id) {
      fetchUserProgress();
      fetchUserData();
      fetchAvatar();
    }
  }, [id, token]);

  return (
    <section className=" gap-14 flex p-5 bg-background flex-col  justify-center items-center  ">
      {/* Background Image with Overlay */}
      <div className="bg-white  xl:h-[50rem] relative w-full inset-0 z-0">
        <img
          className="h-full min-h-[100px]  w-full"
          src={LandingPageUserCardsImage}
          alt=""
        />
        <img
          className="  z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/12"
          src={Frame3}
          alt="CodeRealm"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-background/95"></div>
      </div>

      <div className="z-10 container w-full xl:absolute bottom-[0rem]  text-white font-semibold md:gap-4 gap-5 xl:gap-0 flex flex-col md:flex-row justify-between ">
        <article className="shadow-[0_8px_30px_rgba(255,255,255,0.4)] bg-background flex justify-center items-center border-2 border-accent rounded-md md:rounded-2xl w-full md:w-3/5 text-white text-center">
          <div className="p-4">
            <h1 className="text-xl mb-2">Your Progress</h1>
            {userProgress ? (
              <>
                <p>
                  Completed: {userProgress.completedExercises} /{" "}
                  {userProgress.totalExercises}
                </p>
                {userProgress.nextExercise && (
                  <p className="mt-2">
                    Next: {userProgress.nextExercise.title}
                  </p>
                )}
              </>
            ) : (
              <p>Loading progress...</p>
            )}
          </div>
        </article>

        <article className="bg-background border-2 border-accent rounded-md md:rounded-2xl py-14 md:w-2/5 xl:w-1/5 shadow-[0_8px_30px_rgba(255,255,255,0.4)]">
          <div className="mb-5 flex items-center justify-around">
            <img
              className="w-14 h-14 rounded-full"
              loading="lazy"
              src={avatar}
              alt="userImage"
            />
            <p className="flex flex-col items-center">
              {userData?.username || "Loading..."}
              <span className="text-xs font-normal">
                Level {userData?.level || 1}
              </span>
            </p>
          </div>
          <div className="mt-6 mb-4 flex items-center justify-around">
            <p className="flex flex-col items-center">
              Badges
              <span className="text-xs font-normal">
                {userData?.badgesCount || 0}
              </span>
            </p>
            <p className="flex flex-col items-center">
              XP
              <span className="text-xs font-normal">{userData?.xp || 0}</span>
            </p>
          </div>
          <p className="flex flex-col text-center items-center">
            Rank
            <span className="text-xs font-normal">
              #{userData?.rank || "N/A"}
            </span>
          </p>
        </article>
      </div>

      <h2 className="z-[10] xl:mt-[10rem]   w-full  container  font-bold text-2xl text-white  ">
        Explore the{" "}
        <span className=" text-4xl font-normal tracking-wider	 	 text-accent font-vt323 ">
          REALM
        </span>
      </h2>

      <LandingPageUserCards />

      <article className="border-accent rounded-2xl flex flex-col justify-center items-center p-8 bg-background shadow-lg">
        <h3 className="font-bold text-2xl text-white mb-4">
          Invite a{" "}
          <span className="text-4xl font-normal  font-vt323 text-accent tracking-wider">
            Friend
          </span>
        </h3>
        <p className="text-lg text-white mb-6 text-center leading-relaxed max-w-lg">
          Having fun with CODEREALM? Share the love with a friend (or two)!
          Enter their email, and we'll send them a personal invite to join the
          community.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <input
            type="email"
            placeholder="Enter friend's email"
            className="px-4 py-2 w-full sm:w-72 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent text-gray-800"
          />
          <button className="mt-4 sm:mt-0 px-6 py-3 bg-accent rounded-md hover:bg-accent-dark transition duration-300">
            Send Invite
          </button>
        </div>
      </article>
    </section>
  );
};

export default LandingPageUser;
