import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import DefObjectTable from "./modules/DefObjectTable";

function App() {
  return (
   <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home/>}/>
          <Route path="/projects" exact element={<DefObjectTable route="projects"/>}/>
          <Route path="/recategories" exact element={<DefObjectTable route="recategories"/>}/>
          <Route path="/retypes" exact element={<DefObjectTable route="retypes"/>}/>
          <Route path="/generalaccounts" exact element={<DefObjectTable route="generalaccounts"/>}/>
          <Route path="/businessunits" exact element={<DefObjectTable route="businessunits"/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
