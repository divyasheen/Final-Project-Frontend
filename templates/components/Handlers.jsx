// *-*-*-*-*-*-* handleClick() - for forms *-*-*-*-*-*-*
//First create useState (-> ./Hooks.jsx) which sets the data or use a context (-> ./contexts)
const handleChange = (e) => {
    setThisData({
      ...thisData,
      [e.target.name]: e.target.value,
    });
  };

  // insert this function into each input of your form

// *-*-*-*-*-*-* handleSubmit() *-*-*-*-*-*-*
const handleSubmit = (e) => {
    e.preventDefault()
    
    // lots of logic here to send data to the backend

    }

// *-*-*-*-*-*-*  *-*-*-*-*-*-*

// *-*-*-*-*-*-*  *-*-*-*-*-*-*

// *-*-*-*-*-*-*  *-*-*-*-*-*-*

// *-*-*-*-*-*-*  *-*-*-*-*-*-*

// *-*-*-*-*-*-*  *-*-*-*-*-*-*
