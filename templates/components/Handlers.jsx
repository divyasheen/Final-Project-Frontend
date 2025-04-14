// *-*-*-*-*-*-* handleClick() - for forms *-*-*-*-*-*-*
//First create useState which sets the data 
const handleChange = (e) => {
    setThisData({
      ...thisData,
      [e.target.name]: e.target.value,
    });
  };

  // insiert this function into eacht input of your form

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
