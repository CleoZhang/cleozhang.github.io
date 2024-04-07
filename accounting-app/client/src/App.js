import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import ObjectViewTable from "./modules/ObjectViewTable";

function App() {
  return (
   <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home/>}/>
          <Route path="/projects" exact element={<ObjectViewTable route="projects"/>}/>
          <Route path="/recategories" exact element={<ObjectViewTable route="recategories"/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
