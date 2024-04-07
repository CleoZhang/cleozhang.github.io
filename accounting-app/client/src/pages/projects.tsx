import React from "react";
import styles from "./projects.module.scss";
import axios from "axios";
import * as Yup from "yup";
import { faPen, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { TextButton, SvgButton, newUpdatedObject } from "../modules";
import { FormikInput, TextInput } from "../modules/Input";

const projectsRoot = "http://localhost:3001/projects";

const endpoints = {
  root: projectsRoot,
  bulk: `${projectsRoot}/bulk`,
  all: `${projectsRoot}/all`,
  update: `${projectsRoot}/update`,
};

type IdWithDisplayNames = { id: number } & DisplayNames;

type DisplayNames = {
  name: string;
  shortname: string;
};

type Project = IdWithDisplayNames;

function getYup(existingNames: string[]) {
  return Yup.string()
    .required("必填")
    .test(
      "Unique",
      "重名",
      (value) => !existingNames.some((sn) => sn === value)
    );
}

type ProjectRowProps = {
  project: Project;
  editMode: boolean;
  onDelete: (projectId: number) => void;
  onEdit: (project: Project) => void;
  otherProjects: Project[];
};

function ProjectRow(props: ProjectRowProps) {
  const { project, editMode, onDelete } = { ...props };
  const [editNames, setEditNames] = React.useState(false);
  const [name, setName] = React.useState(project.name);
  const [shortname, setShortname] = React.useState(project.shortname);

  return (
    <tr key={project.id}>
      <td>
        {editNames ? (
          <FormikInput
            initialValues={{ name }}
            validationSchema={Yup.object().shape({
              name: getYup(props.otherProjects.map((p) => p.name)),
            })}
            formikInputs={[{ inputName: "name" }]}
            inputId="editName"
            onSubmit={(newObj) => setName(newObj.name)}
          />
        ) : (
          <>{project.name}</>
        )}
      </td>
      <td>
        {editNames ? (
          <TextInput value={shortname} onChange={setShortname} />
        ) : (
          <>{project.shortname}</>
        )}
      </td>
      {editMode && (
        <>
          <td>
            {editNames ? (
              <SvgButton
                icon={faCheck}
                onClick={() => {
                  props.onEdit(newUpdatedObject(project, { name, shortname }));
                  setEditNames(!editNames);
                }}
                title={`保存'${project.name}'`}
              />
            ) : (
              <SvgButton
                icon={faPen}
                onClick={() => setEditNames(!editNames)}
                title={`编辑'${project.name}'`}
              />
            )}
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
  const [editMode, setEditMode] = React.useState(false);

  React.useEffect(() => {
    axios.get(endpoints.all).then((response) => {
      setProjects(response.data);
    });
  }, []);

  function onCreate(
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

  function onEdit(newProject: Project) {
    axios.post(endpoints.update, newProject).then((response) => {
      setProjects(response.data);
    });
  }

  return (
    <>
      <TextButton
        text={editMode ? "取消编辑模式" : "编辑模式"}
        onClick={() => setEditMode(!editMode)}
      />
      {editMode && (
        <FormikInput
          initialValues={{ name: "", shortname: "" }}
          onSubmit={onCreate}
          validationSchema={Yup.object().shape({
            name: getYup(projects.map((p) => p.name)),
            shortname: getYup(projects.map((p) => p.shortname)),
          })}
          inputId="createProject"
          formikInputs={[
            { label: "项目名称", inputName: "name" },
            { label: "简称", inputName: "shortname" },
          ]}
          submitButtonName="创建"
        />
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
              onEdit={onEdit}
              otherProjects={projects.filter((p) => p.id !== project.id)}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Projects;
