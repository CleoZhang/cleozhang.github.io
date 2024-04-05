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
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  icon: IconDefinition;
  title?: string;
};

export function SvgButton(props: SvgButtonProps) {
  return (
    <FontAwesomeIcon
      icon={props.icon}
      onClick={props.onClick}
      title={props.title}
      className={styles.button}
    />
  );
}
