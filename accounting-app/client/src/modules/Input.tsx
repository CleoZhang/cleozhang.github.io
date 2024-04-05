import { ErrorMessage, Field } from "formik";
import React from "react";
import styles from "./Input.module.scss";

type FormikInputProps = {
  label?: string;
  formikId: string;
  formikName: string;
};

export function FormikInput(props: FormikInputProps) {
  return (
    <>
      {props.label && <label>{props.label}</label>}
      <Field id={props.formikId} name={props.formikName} />
      <ErrorMessage
        name={props.formikName}
        component="span"
        className={styles.error}
      />
    </>
  );
}
