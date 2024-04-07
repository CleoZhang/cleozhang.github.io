import React from "react";
import styles from "./ObjectViewTable.module.scss";
import { faPen, faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import {
  TextButton,
  SvgButton,
  newUpdatedObject,
  axiosGetAll,
  axiosCreate,
  axiosDelete,
  axiosUpdate,
  TextInput,
  IdWithDisplayName,
} from ".";
import { Link } from "react-router-dom";

const devMode: boolean = true;

type RowProps = {
  object: IdWithDisplayName;
  editMode: boolean;
  onEdit: (object: IdWithDisplayName) => void;
  otherObjects: IdWithDisplayName[];
  onDelete?: (objectId: number) => void;
  isCreate: boolean;
};

function Row(props: RowProps) {
  const { object, editMode, onDelete, isCreate } = { ...props };
  const [editNames, setEditNames] = React.useState(isCreate);
  const [name, setName] = React.useState(object.name);
  const [shortname, setShortname] = React.useState(object.shortname);
  const hasShortName = object.shortname !== undefined;
  const disabled = name === "" || (hasShortName && shortname === "");

  function onSave() {
    if (
      props.otherObjects.some(
        (p) => p.name === name || (hasShortName && p.shortname === shortname)
      )
    ) {
      alert(`无法${isCreate ? "添加" : "更改"}编号${object.id}: 名称有重复`);
    } else {
      props.onEdit(newUpdatedObject(object, { name, shortname }));
      if (isCreate) {
        setName("");
        setShortname("");
      } else {
        setEditNames(!editNames);
      }
    }
  }

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
            <TextInput
              value={shortname!}
              onChange={setShortname}
              onEnter={() => !disabled && onSave()}
            />
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
                icon={isCreate ? faPlus : faCheck}
                disabled={disabled}
                onClick={onSave}
                title={`保存'${object.name}'`}
              />
            ) : (
              <SvgButton
                icon={faPen}
                onClick={() => setEditNames(!editNames)}
                title={`编辑'${object.name}'`}
              />
            )}{" "}
            {onDelete !== undefined && (
              <SvgButton
                icon={faTrashCan}
                onClick={() => onDelete(object.id)}
                title={`删除'${object.name}'`}
              />
            )}
          </td>
        </>
      )}
    </tr>
  );
}

function ObjectViewTable(props: { route: string }) {
  const [objects, setObjects] = React.useState<IdWithDisplayName[]>([]);
  const [editMode, setEditMode] = React.useState(devMode);
  const maxObjectId = Math.max(...objects.map((p) => p.id));

  React.useEffect(() => axiosGetAll(props.route, setObjects), [props.route]);

  const hasShortName = objects.some((o) => o.shortname !== undefined);

  const newObj: IdWithDisplayName = hasShortName
    ? { id: maxObjectId + 1, name: "", shortname: "" }
    : { id: maxObjectId + 1, name: "" };

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
            {editMode && <th></th>}
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
              isCreate={false}
            />
          ))}
          {editMode && (
            <Row
              object={newObj}
              editMode={editMode}
              onEdit={(newObj) => axiosCreate(props.route, newObj, setObjects)}
              otherObjects={objects}
              isCreate
            />
          )}
        </tbody>
      </table>
    </>
  );
}

export default ObjectViewTable;
