/* DISCLAIMER: Don't create the Consumer fist ... the numbers in the filenames have a reason.

Firstly if you wanna use contexts you have to create a Provider. Each context should have a own Provider-file like: FeedbackForm, UserForm and stuff like this

1. Import "createContext" and "useState"
2. Create the Context - which will be exported
3. Create the Provider itself - don't foregt to give "children" as parameter
    3.1 Inside the Provider Funktion create the State you want to use globally
    3.2 If necessary add some logic - do what ever you want. 
    ...
    3.3 After you done what you wished for with your state you have to wrap it into a variable to send it all over the project.
4. Create return which will wrap up the components which can use the context and give the state as parameter.
5. Export the Provider as "default"

*/

import {createContext, useState} from "react;"

export const NameContext = createContext();

function ContextProvider({children}) {

    const [state, setState] = useState("")

    //logic here

    const data = {
        state,
        setState
    }

    return (
        <NameContext.Provider value ={data}>
        {children}
        </NameContext.Provider>
    )
}

export default ContextProvider;
