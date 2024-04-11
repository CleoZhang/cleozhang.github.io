import React from "react";
import styles from "./DefObjectTable.module.scss";
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
  DefObject,
  SelectInput,
  isNullOrEmpty,
  IdWithDisplayName,
} from ".";
import { Link } from "react-router-dom";

const devMode: boolean = true;

type RowProps = {
  object: DefObject;
  editMode: boolean;
  onEdit: (object: DefObject) => void;
  otherObjects: DefObject[];
  hasShortname: boolean;
  reCategoryOptions?: IdWithDisplayName[];
} & (
  | { isCreate: false; onDelete: (objectId: number) => void }
  | { isCreate: true; onDelete?: undefined }
);

function Row(props: RowProps) {
  const { object, editMode, onDelete, isCreate, hasShortname } = {
    ...props,
  };
  const hasReCategory = props.reCategoryOptions !== undefined;
  const [editNames, setEditNames] = React.useState(isCreate);
  const [name, setName] = React.useState(object.name);
  const [shortname, setShortname] = React.useState(object.shortname);
  const [RECategoryId, setRECategoryId] = React.useState(object.RECategoryId);

  const disabled =
    isNullOrEmpty(name) ||
    (hasShortname && isNullOrEmpty(shortname)) ||
    (hasReCategory && isNullOrEmpty(RECategoryId));

  function onSave() {
    if (
      props.otherObjects.some(
        (p) => p.name === name || (hasShortname && p.shortname === shortname)
      )
    ) {
      alert(`无法${isCreate ? "添加" : "更改"}编号${object.id}: 名称有重复`);
    } else {
      props.onEdit(newUpdatedObject(object, { name, shortname, RECategoryId }));
      if (isCreate) {
        setName("");
        setShortname("");
      } else {
        setEditNames(!editNames);
      }
    }
  }

  function onEnter() {
    !disabled && onSave();
  }

  return (
    <tr key={object.id}>
      <td>{object.id}</td>
      <td>
        {editNames ? (
          <TextInput value={name} onChange={setName} onEnter={onEnter} />
        ) : (
          <>{object.name}</>
        )}
      </td>
      {hasShortname && (
        <td>
          {editNames ? (
            <TextInput
              value={shortname!}
              onChange={setShortname}
              onEnter={onEnter}
            />
          ) : (
            <>{object.shortname}</>
          )}
        </td>
      )}
      {hasReCategory && (
        <td>
          {editNames ? (
            <SelectInput
              labelled={{ id: "dropdown" }}
              options={props.reCategoryOptions!}
              onChange={(newId) => setRECategoryId(newId!)}
              value={RECategoryId!}
            />
          ) : (
            <>
              {
                props.reCategoryOptions?.find((o) => o.id === RECategoryId)
                  ?.name
              }
            </>
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
                onClick={onEnter}
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

function DefObjectTable(props: { route: string }) {
  const [objects, setObjects] = React.useState<DefObject[]>([]);
  const [editMode, setEditMode] = React.useState(devMode);
  const maxObjectId =
    objects.length === 0 ? 0 : Math.max(...objects.map((p) => p.id));

  const hasShortName =
    props.route === "projects" || props.route === "generalaccounts";
  const hasReCategory = props.route === "retypes";

  const reCategoryOptions = React.useRef<IdWithDisplayName[]>();
  React.useEffect(() => {
    axiosGetAll(props.route, setObjects);
    if (hasReCategory) {
      axiosGetAll("recategories", (res) => (reCategoryOptions.current = res));
      console.log(reCategoryOptions);
    }
  }, [props.route, hasReCategory]);

  const newObj: DefObject = {
    id: maxObjectId + 1,
    name: "",
    shortname: "",
    RECategoryId: 1,
  };

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
            {hasReCategory && <th>分类</th>}
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
              hasShortname={hasShortName}
              reCategoryOptions={reCategoryOptions.current}
            />
          ))}
          {editMode && (
            <Row
              object={newObj}
              editMode={editMode}
              onEdit={(newObj) => axiosCreate(props.route, newObj, setObjects)}
              otherObjects={objects}
              isCreate
              hasShortname={hasShortName}
              reCategoryOptions={reCategoryOptions.current}
            />
          )}
        </tbody>
      </table>
    </>
  );
}

export default DefObjectTable;
