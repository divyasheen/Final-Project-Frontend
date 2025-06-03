import ProgressBar from "@ramonak/react-progress-bar";

function ProfilNav() {
  const badges = ["HTML-Badge", "CSS-Badge", "JS-Badge"];

  return (
    <>
      <h1>ProfileUser</h1>
      <div>
        <div>Profil Picture</div>
        <div>Username</div>
        <div>Followers</div>
        <div>Following</div>
      </div>

      <div>
        <h2>Info</h2>
        <div>Individual text about you</div>
        <div>Location - from BE</div>
        <div>Joined at - from BE</div>
        <div>List of linked Profiles (Insta, Github)</div>
        <div>Skills/Languages - from BE</div>
      </div>

      <div>
        <h2>Stats</h2>
        <div>XP - from BE</div>
        <ProgressBar completed={50} />
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
    </>
  );
}

export default ProfilNav;
