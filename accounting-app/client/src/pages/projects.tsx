import React from "react";
import styles from "./projects.module.scss";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { TextButton, SvgButton } from "../modules";
import { FormikInput } from "../modules/Input";

const projectsRoot = "http://localhost:3001/projects";

const endpoints = {
  root: projectsRoot,
  bulk: `${projectsRoot}/bulk`,
  all: `${projectsRoot}/all`,
};

type IdWithDisplayNames = { id: number } & DisplayNames;

type DisplayNames = {
  name: string;
  shortname: string;
};

type Project = IdWithDisplayNames;

type ProjectRowProps = {
  project: Project;
  editMode: boolean;
  onDelete: (projectId: number) => void;
};

function ProjectRow(props: ProjectRowProps) {
  const { project, editMode, onDelete } = { ...props };
  const [editNames, setEditNames] = React.useState(false);

  function onSubmit(data: DisplayNames) {
    console.log(data);
  }

  return (
    <tr key={project.id}>
      <td>{editNames ? <></> : <>{project.name}</>}</td>
      <td>{project.shortname}</td>
      {editMode && (
        <>
          <td>
            <SvgButton
              icon={faPen}
              onClick={() => setEditNames(!editNames)}
              title={`编辑'${project.name}'`}
            />
          </td>
          <td>
            <SvgButton
              icon={faTrashCan}
              onClick={() => onDelete(project.id)}
              title={`删除'${project.name}'`}
            />
          </td>
        </>
      )}
    </tr>
  );
}

function Projects() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [editMode, setEditMode] = React.useState(true);

  React.useEffect(() => {
    axios.get(endpoints.all).then((response) => {
      setProjects(response.data);
    });
  }, []);

  // let history = useHistory;
  const initialValues = { name: "", shortname: "" };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("必填"),
    shortname: Yup.string().required("必填"),
  });

  function onSubmit(
    newProjects: DisplayNames,
    actions: { resetForm: () => void }
  ) {
    axios.post(endpoints.root, newProjects).then((response) => {
      setProjects(response.data);
      actions.resetForm();
    });
  }

  function onDelete(projectId: number) {
    axios
      .delete(endpoints.root, { data: { id: projectId } })
      .then((response) => {
        setProjects(response.data);
      });
  }

  return (
    <>
      <TextButton text="编辑模式" onClick={() => setEditMode(!editMode)} />
      {editMode && (
        <div>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form>
              <FormikInput
                label="项目名称"
                formikId="inputCreateProject"
                formikName="name"
              />
              <FormikInput
                label="简称"
                formikId="inputCreateProject"
                formikName="shortname"
              />
              <TextButton text="创建" type="submit" />
            </Form>
          </Formik>
        </div>
      )}
      <table className={styles.projects}>
        <thead>
          <tr>
            <th>项目名称</th>
            <th>简称</th>
            {editMode && (
              <>
                <th></th>
                <th></th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              editMode={editMode}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Projects;
