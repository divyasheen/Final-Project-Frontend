/* DISCLAIMER: 
Strings which start and end with "0_0" are placeholders. Please insert the informations you need for your project. 
*/

// *-*-*-*-*-*-* useState() - for forms *-*-*-*-*-*-*
const [thisData, setThisData] = useState({
    id: null,
    item1: "",
    item2: "",
    item3: "",
    // ...
  });


// *-*-*-*-*-*-* useEffect() - for fetching  *-*-*-*-*-*-*
useEffect(() => {
    fetch("0_0 YOUR URL HERE (API, DATABASE OR .ENV) 0_0")
      .then((resp) => resp.json())
      .then((data) => setPhrase(data)) // JB: "setPhrase()" is a state we have to create beforehand
      .catch((error) => console.log(error.message));
  }, []); // JB: ",[]" for fetching after each rendering of the component


// *-*-*-*-*-*-* useEffect - once *-*-*-*-*-*-*
// The empyt dependency at the end is important.
useEffect(() => {

    // insert logic here

}, [])


// *-*-*-*-*-*-* useEffect - on state change *-*-*-*-*-*-*
// The state dependency at the end is important.
useEffect(() => {

    // insert logic here

}, [stateName])


// *-*-*-*-*-*-* useEffect - on unmount *-*-*-*-*-*-*
// No dependency at the end is important AND the return (there you delete stuff most of the time).
useEffect(() => {
    return() => {

        // insert logic here
        
    }
})

// *-*-*-*-*-*-* useEffect - after every render *-*-*-*-*-*-*
// No dependency at the end is important.
useEffect (() => {

    // insert logic here

})


// *-*-*-*-*-*-*  *-*-*-*-*-*-*
