/* DISCLAIMER: Create the Provider first ... the numbers in the filenames have a reason.

BEFORE you use a context in your project you have to wrap "App" inside the Provider.

1. Go inside "main.jsx"
2. Import the Provider
3. Wrap the Provider around "<App />" but inside "<BrowserRouter>"
*/

// inside "main.jsx"
import ContextProvider from "./1_Provider";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ContextProvider>
      <App />
    </ContextProvider>
  </BrowserRouter>
);

/* NOW head over to the component where you wanna use the context - in our example it "Component.jsx" 

1. Import the context and "useContext"
2. If necessary destructur the context with {only_the_names_of_states_you_need}
*/

// inside "Component.jsx"
import {useContext} from "react"
import {NameContext} from "../contexts/1_Provider";

const {state} = useContext(NameContext);


