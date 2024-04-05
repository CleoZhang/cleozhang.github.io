import React from 'react'
import axios from "axios";

const projectsRoot = "http://localhost:3001/projects";

const endpoints = {
  root: projectsRoot,
  bulk: `${projectsRoot}/bulk`,
  all: `${projectsRoot}/all`,
}

type IdWithNames = {
  id: number;
  name: string;
  shortname: string;
}

type Project = IdWithNames;
  
function Project() {
  const [projects, setProjects] = React.useState<Project[]>([]);

  React.useEffect(() => {
    axios.get(endpoints.all).then((response) => {
      setProjects(response.data);
    })
  }, [])

  return (
    <ul>
        {projects.map(project => <li key={project.id}>{project.name}</li>)}
    </ul>
  );
}

export default Project
