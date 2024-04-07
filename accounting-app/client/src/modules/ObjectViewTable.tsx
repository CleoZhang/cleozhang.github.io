import React from "react";
import styles from "./ObjectViewTable.module.scss";
import * as Yup from "yup";
import { faPen, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import {
  TextButton,
  SvgButton,
  newUpdatedObject,
  axiosGetAll,
  axiosCreate,
  axiosDelete,
  axiosUpdate,
  yupReqStr,
  FormikForm,
  TextInput,
  IdWithDisplayName,
} from ".";
import { Link } from "react-router-dom";

type RowProps = {
  object: IdWithDisplayName;
  editMode: boolean;
  onDelete: (objectId: number) => void;
  onEdit: (object: IdWithDisplayName) => void;
  otherObjects: IdWithDisplayName[];
};

function Row(props: RowProps) {
  const { object, editMode, onDelete } = { ...props };
  const [editNames, setEditNames] = React.useState(false);
  const [name, setName] = React.useState(object.name);
  const [shortname, setShortname] = React.useState(object.shortname);
  const hasShortName = shortname !== undefined;

  return (
    <tr key={object.id}>
      <td>{object.id}</td>
      <td>
        {editNames ? (
          <TextInput value={name} onChange={setName} />
        ) : (
          <>{object.name}</>
        )}
      </td>
      {hasShortName && (
        <td>
          {editNames ? (
            <TextInput value={shortname} onChange={setShortname} />
          ) : (
            <>{object.shortname}</>
          )}
        </td>
      )}
      {editMode && (
        <>
          <td>
            {editNames ? (
              <SvgButton
                icon={faCheck}
                disabled={name === "" || shortname === ""}
                onClick={() => {
                  if (
                    props.otherObjects.some(
                      (p) =>
                        p.name === name ||
                        (hasShortName && p.shortname === shortname)
                    )
                  ) {
                    alert(`无法更改编号${object.id}: 名称有重复`);
                  } else {
                    props.onEdit(newUpdatedObject(object, { name, shortname }));
                    setEditNames(!editNames);
                  }
                }}
                title={`保存'${object.name}'`}
              />
            ) : (
              <SvgButton
                icon={faPen}
                onClick={() => setEditNames(!editNames)}
                title={`编辑'${object.name}'`}
              />
            )}
          </td>
          <td>
            <SvgButton
              icon={faTrashCan}
              onClick={() => onDelete(object.id)}
              title={`删除'${object.name}'`}
            />
          </td>
        </>
      )}
    </tr>
  );
}

function ObjectViewTable(props: { route: string }) {
  const [objects, setObjects] = React.useState<IdWithDisplayName[]>([]);
  const [editMode, setEditMode] = React.useState(false);
  const maxObjectId = Math.max(...objects.map((p) => p.id));

  React.useEffect(() => axiosGetAll(props.route, setObjects), [props.route]);

  const hasShortName = objects.some((o) => o.shortname !== undefined);
  const initialValues = hasShortName
    ? { name: "", shortname: "" }
    : { name: "" };
  const validationSchema = Yup.object().shape(
    hasShortName
      ? {
          name: yupReqStr(objects.map((p) => p.name)),
          shortname: yupReqStr(objects.map((p) => p.shortname!)),
        }
      : {
          name: yupReqStr(objects.map((p) => p.name)),
        }
  );
  const formikInputs = hasShortName
    ? [
        { label: "新建", inputName: "name" },
        { label: "简称", inputName: "shortname" },
      ]
    : [{ label: "新建", inputName: "name" }];

  return (
    <>
      <Link to="/">返回主页</Link>
      <br />
      <TextButton
        text={editMode ? "关闭编辑模式" : "编辑模式"}
        onClick={() => setEditMode(!editMode)}
      />
      <table className={styles.objects}>
        <thead>
          <tr>
            <th>编号</th>
            <th>名称</th>
            {hasShortName && <th>简称</th>}
            {editMode && (
              <>
                <th></th>
                <th></th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {objects.map((obj) => (
            <Row
              key={obj.id}
              object={obj}
              editMode={editMode}
              onDelete={(id) => axiosDelete(props.route, id, setObjects)}
              onEdit={(object) => axiosUpdate(props.route, object, setObjects)}
              otherObjects={objects.filter((p) => p.id !== obj.id)}
            />
          ))}
        </tbody>
      </table>

      {editMode && (
        <>
          <FormikForm
            initialValues={initialValues}
            onSubmit={(newNames, actions) =>
              axiosCreate(
                props.route,
                { id: maxObjectId + 1, ...newNames },
                setObjects,
                actions.resetForm
              )
            }
            validationSchema={validationSchema}
            inputId="createObject"
            formikInputs={formikInputs}
            submitButtonName="创建"
          />
        </>
      )}
    </>
  );
}

export default ObjectViewTable;
