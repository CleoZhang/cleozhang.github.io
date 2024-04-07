import React from "react";
import styles from "./Button.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type TextButtonProps = {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "submit" | "button" | "reset";
};

export function TextButton(props: TextButtonProps) {
  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      className={styles.button}
    >
      {props.text}
    </button>
  );
}

type SvgButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon: IconDefinition;
  title?: string;
  type?: "submit" | "button" | "reset";
  form?: string;
  disabled?: boolean;
};

export function SvgButton(props: SvgButtonProps) {
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      form={props.form}
      disabled={props.disabled}
    >
      <FontAwesomeIcon
        icon={props.icon}
        title={props.title}
        className={styles.button}
      />
    </button>
  );
}
