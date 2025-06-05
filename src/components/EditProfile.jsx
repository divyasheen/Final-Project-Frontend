import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/userIdContext";

function EditProfile() {
  // -*-*- Hooks: States, Contexts ... -*-*-
  const { userId} = useContext(UserContext);

  // JB: userId is stored as a string at the localStorage therefore we need to change it into a Number to work with this at the BE - the 10 stands for decimal number
  const [formData, setFormData] = useState({ id: parseInt(userId, 10) }); 

  const [file, setFile] = useState();
  
  // -*-*- Handlers -*-*-
  //JB: Let's make magic happen when change the input fields
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);

    console.log(file);
    
  }

  const handleSubmit = async (e) => {
    //JB: Do not reset the page! Never! EVER!
    e.preventDefault();
    
    //JB: instead try to fetch the api to update the user (postman can do this but the stupid browser is stupid)
    try {
      const res = await fetch(`http://localhost:5000/api/user/${userId}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update user");
      }

    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  const handleUpload = async() => {
    try {
      const res = await fetch(` http://localhost:5000/${userId}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify(file, userId),
      });const data = await res.json();
      console.log('Upload success:', data);
    } catch (err) {
      console.error('Upload error:', err);
    }
  }

  const borderButton = {
    border: "1px solid blue",
    backgroundColor: "lightblue",
  };

  return (
    <>
      <div>
        <div>
          <label>Upload a picture</label>
          <input type="file" name="picture" accept="image/*" onChange = {handleFileChange}/>
          <button onClick = {handleUpload} style={borderButton}>
            Upload
          </button>
        </div>

        <form action="" method="put" onSubmit={handleSubmit}>
          <label>Location</label>
          <input
            type="text"
            name="location"
            onChange={handleChange}
            value={formData.location || ""}
          />
          <label>Write something about you: </label>
          <textarea
            name="info"
            id="info"
            onChange={handleChange}
            value={formData.info || ""}
          ></textarea>
          <label>Social:</label>
          <input
            type="text"
            name="social"
            onChange={handleChange}
            value={formData.social || ""}
            placeholder="Instagram, Github, etc."
          />
          <button type="submit" style={borderButton}>
            Save changes
          </button>
        </form>
        <form action="/reset-password" method="post">
          <button type="submit" style={borderButton}>
            Reset Password
          </button>
        </form>
      </div>
    </>
  );
}

export default EditProfile;
