import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import ProjectsPage from "./pages/projects";
import RECategoriesPage from "./pages/recategories";

function App() {
  return (
   <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home/>}/>
          <Route path="/projects" exact element={<ProjectsPage/>}/>
          <Route path="/recategories" exact element={<RECategoriesPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
