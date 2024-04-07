import React from "react";
import styles from "./projects.module.scss";
import * as Yup from "yup";
import { faPen, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import {
  TextButton,
  SvgButton,
  newUpdatedObject,
  IdWithDisplayNames,
  axiosGetAll,
  axiosCreate,
  axiosDelete,
  axiosUpdate,
  yupReqStr,
  FormikForm,
  TextInput,
} from "../modules";

const route = "projects";

type RowProps = {
  project: IdWithDisplayNames;
  editMode: boolean;
  onDelete: (projectId: number) => void;
  onEdit: (project: IdWithDisplayNames) => void;
  otherProjects: IdWithDisplayNames[];
};

function Row(props: RowProps) {
  const { project, editMode, onDelete } = { ...props };
  const [editNames, setEditNames] = React.useState(false);
  const [name, setName] = React.useState(project.name);
  const [shortname, setShortname] = React.useState(project.shortname);

  return (
    <tr key={project.id}>
      <td>{project.id}</td>
      <td>
        {editNames ? (
          <TextInput value={name} onChange={setName} />
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
                disabled={name === "" || shortname === ""}
                onClick={() => {
                  if (
                    props.otherProjects.some(
                      (p) => p.name === name || p.shortname === shortname
                    )
                  ) {
                    alert(`无法更改项目${project.id}: 项目名称/简称有重复`);
                  } else {
                    props.onEdit(
                      newUpdatedObject(project, { name, shortname })
                    );
                    setEditNames(!editNames);
                  }
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

function ProjectsPage() {
  const [projects, setProjects] = React.useState<IdWithDisplayNames[]>([]);
  const [editMode, setEditMode] = React.useState(false);
  const maxProjectId = Math.max(...projects.map((p) => p.id));

  React.useEffect(() => axiosGetAll(route, setProjects), []);

  return (
    <>
      <TextButton
        text={editMode ? "取消编辑模式" : "编辑模式"}
        onClick={() => setEditMode(!editMode)}
      />
      <table className={styles.projects}>
        <thead>
          <tr>
            <th>编号</th>
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
            <Row
              key={project.id}
              project={project}
              editMode={editMode}
              onDelete={(id) => axiosDelete(route, id, setProjects)}
              onEdit={(project) => axiosUpdate(route, project, setProjects)}
              otherProjects={projects.filter((p) => p.id !== project.id)}
            />
          ))}
        </tbody>
      </table>

      {editMode && (
        <>
          <FormikForm
            initialValues={{ name: "", shortname: "" }}
            onSubmit={(newNames, actions) =>
              axiosCreate(
                route,
                { id: maxProjectId + 1, ...newNames },
                setProjects,
                actions.resetForm
              )
            }
            validationSchema={Yup.object().shape({
              name: yupReqStr(projects.map((p) => p.name)),
              shortname: yupReqStr(projects.map((p) => p.shortname)),
            })}
            inputId="createProject"
            formikInputs={[
              { label: "新建项目名称", inputName: "name" },
              { label: "简称", inputName: "shortname" },
            ]}
            submitButtonName="创建"
          />
        </>
      )}
    </>
  );
}

export default ProjectsPage;
