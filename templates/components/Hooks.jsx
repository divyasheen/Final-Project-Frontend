/* DISCLAIMER: 
Strings which start and end with "0_0" are placeholders. Please insert the informations you need for your project. 
*/

// *-*-*-*-*-*-* useState() - for forms *-*-*-*-*-*-*
const [thisData, setThisData] = useState({
    id: null,
    item1: "0_0",
    item2: "0_0",
    item3: "0_0",
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
useEffect(() => {

    // insert logic here

}, [])


// *-*-*-*-*-*-* useEffect - on state change *-*-*-*-*-*-*
useEffect(() => {

    // insert logic here

}, [stateName])


// *-*-*-*-*-*-* useEffect - on unmount *-*-*-*-*-*-*
useEffect(() => {
    return() => {

        // insert logic here
        
    }
})

// *-*-*-*-*-*-* useEffect - after every render *-*-*-*-*-*-*
useEffect (() => {

    // insert logic here

})


// *-*-*-*-*-*-*  *-*-*-*-*-*-*
