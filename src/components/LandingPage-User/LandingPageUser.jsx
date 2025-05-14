import React from "react";
import "./LandingPageUser.scss";
import Frame3 from "../../assets/images/Frame3.png";
import UserImage from "../../assets/images/userImage.jpeg";
import LandingPageUserCards from "./LandingPageUserCards";
import LandingPageUserCardsImage from "../../assets/images/LandingPageUserBackGround.jpg";
import { useParams } from "react-router-dom";
const LandingPageUser = () => {

const {id}=useParams()
console.log(id);



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
          className="  z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-3/12"
          src={Frame3}
          alt="CodeRealm"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-background/95"></div>
      </div>

      <div className="z-10 container w-full xl:absolute bottom-[0rem]  text-white font-semibold md:gap-4 gap-5 xl:gap-0 flex flex-col md:flex-row justify-between ">
        <article
          className=" shadow-[0_8px_30px_rgba(255,255,255,0.4)]
 bg-background  flex justify-center items-center border-2 border-accent rounded-md  md:rounded-2xl w-full  md:w-3/5     text-white text-center "
        >
          <h1 className="  text-xl">Lesson stuff ... Status and Next Lesson</h1>
        </article>

        <article
          className="bg-background border-2 border-accent rounded-md   md:rounded-2xl py-14 md:w-2/5 xl:w-1/5 shadow-[0_8px_30px_rgba(255,255,255,0.4)]
 "
        >
          <div className="mb-5 flex items-center justify-around">
            <img
              className="w-14 h-14 rounded-full"
              loading="lazy"
              src={UserImage}
              alt="userImage"
            />
            <p className="flex flex-col items-center">
              Username
              <span className="text-xs font-normal">level 9000</span>
            </p>
          </div>
          <div className=" mt-6 mb-4 flex items-center   justify-around">
            <p className="flex flex-col items-center">
              Badges
              <span className="text-xs font-normal">12</span>
            </p>
            <p className="flex flex-col items-center">
              XP
              <span className="text-xs font-normal">3000</span>
            </p>
          </div>

          <p className="flex flex-col text-center items-center ">
            Rank
            <span className="text-xs font-normal">12</span>
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
    Invite a <span className="text-4xl font-normal  font-vt323 text-accent tracking-wider">Friend</span>
  </h3>
  <p className="text-lg text-white mb-6 text-center leading-relaxed max-w-lg">
    Having fun with CODEREALM? Share the love with a friend (or two)! Enter their email, and we’ll send them a personal invite to join the community.
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
