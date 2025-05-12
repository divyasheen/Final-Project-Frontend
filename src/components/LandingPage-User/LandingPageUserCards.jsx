import React from "react";
import Apion from "../../assets/images/Apion.png";
import Bugaduni from "../../assets/images/Bugaduni.png";
import Crypta from "../../assets/images/Crypta.png";
import Forumia from "../../assets/images/Forumia.png";
import University from "../../assets/images/University.png";
import PlayGround from "../../assets/images/PlayGround.png";
import { NavLink } from "react-router-dom";

const LandingPageUserCards = () => {
  const cards = [
    {
      title: "UNIVERSITY",
      backGroundImg: University,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eros erat, interdum vitae viverra sed, congue eu urna. Pellentesque sit amet turpis orci.",
    },
    {
      title: "PLAY GROUND",
      backGroundImg: PlayGround,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eros erat, interdum vitae viverra sed, congue eu urna. Pellentesque sit amet turpis orci.",
    },
    {
      title: "CSS CRYPTA",
      backGroundImg: Crypta,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eros erat, interdum vitae viverra sed, congue eu urna. Pellentesque sit amet turpis orci.",
    },
    {
      title: "FORUMIA",
      backGroundImg: Forumia,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eros erat, interdum vitae viverra sed, congue eu urna. Pellentesque sit amet turpis orci.",
    },
    {
      title: "BUGADUNE",
      backGroundImg: Bugaduni,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eros erat, interdum vitae viverra sed, congue eu urna. Pellentesque sit amet turpis orci.",
    },
    {
      title: "TOWER OF APION",
      backGroundImg: Apion,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eros erat, interdum vitae viverra sed, congue eu urna. Pellentesque sit amet turpis orci.",
    },
  ];

  return (
    <article className="container flex justify-between gap-1 flex-wrap mt-5">
      {cards.map((c, i) => (
        <section key={i} className="w-full mb-12 sm:w-5/12 lg:w-3/12">
          <div
            className="relative rounded-2xl border-2 border-accent p-4 min-h-[350px] xl:min-h-[550px] text-white bg-cover bg-center flex flex-col justify-between transition-transform hover:scale-105 duration-300 shadow-[0_8px_30px_rgba(255,255,255,0.4)]
 overflow-hidden"
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
      ))}
      
    </article>




  

  );
};

export default LandingPageUserCards;
