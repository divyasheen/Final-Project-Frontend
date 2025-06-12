import React from "react";
import Apion from "../../assets/images/Apion.png";
import Bugaduni from "../../assets/images/Bugaduni.png";
import Crypta from "../../assets/images/Crypta.png";
import Forumia from "../../assets/images/Forumia.png";
import University from "../../assets/images/University.png";
import PlayGround from "../../assets/images/PlayGround.png";
import { useNavigate } from "react-router-dom";

const LandingPageUserCards = () => {
  let navigate = useNavigate();
  const cards = [
    {
      title: "UNIVERSITY",
      backGroundImg: University,
      description:
        "This is the place where the user acquires his knowledge. This is where the knowledge of many generations of the brightest minds from CodeRealm is collected. Lessons can be completed in theuniversity to collect knowledge and XP.",
    },

    {
      title: "FORUMIA",
      backGroundImg: Forumia,
      description:
        "A digital city with a lively forum.Other students post questions there.They can help or research for themselves.",
    },
    {
      title: "PLAY GROUND",
      backGroundImg: PlayGround,
      description:
        "A free, creative space where the magic of code flows freely -hackathons, custom projects and experiments are created here.",
    },
    {
      title: "CSS CRYPTA",
      backGroundImg: Crypta,
      description: "COMING SOON",
    },
    {
      title: "BUGADUNE",
      backGroundImg: Bugaduni,
      description: "COMING SOON",
    },
    {
      title: "TOWER OF APION",
      backGroundImg: Apion,
      description: "COMING SOON",
    },
  ];

  return (
    <article className="container flex justify-between gap-1 flex-wrap mt-5">
      {cards.map((c, i) => {
        // Grey out last 3 cards
        const isComingSoon = i >= cards.length - 3;
        return (
          <section
            onClick={() => {
              if (!isComingSoon) {
                navigate(`/${c.title.toLowerCase().replace(/\s+/g, "")}`);
              }
            }}
            key={i}
            className={`w-full mb-12 sm:w-5/12 lg:w-3/12 ${
              isComingSoon
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : "cursor-pointer"
            }`}
          >
            <div
              className="relative rounded-2xl border-2 border-accent p-4 min-h-[350px] xl:min-h-[550px] text-white bg-cover bg-center flex flex-col justify-between transition-transform hover:scale-105 duration-300 shadow-[0_8px_30px_rgba(255,255,255,0.4)] overflow-hidden"
              style={{ backgroundImage: `url(${c.backGroundImg})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/54 z-0"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <h3 className="text-2xl text-accent font-bold">{c.title}</h3>
              </div>
              <p className="text-sm mt-1 bg-black/50 p-2 rounded">
                {c.description}
              </p>
            </div>
          </section>
        );
      })}
    </article>
  );
};

export default LandingPageUserCards;
