import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikConfig,
  FormikValues,
} from "formik";
import React from "react";
import styles from "./Input.module.scss";
import { Focusable, Key, classNames } from "./";
import { TextButton } from "./Button";

export function FormikForm<
  Values extends FormikValues = FormikValues,
  ExtraProps = {}
>(
  props: FormikConfig<Values> &
    ExtraProps & {
      inputId: string;
      formikInputs: FormikInputProps[];
      submitButtonName?: string;
      formId?: string;
    }
) {
  return (
    <Formik {...props}>
      <Form id={props.formId}>
        {props.formikInputs.map((fi, index) => (
          <FormikInput key={index} {...fi} inputId={props.inputId} />
        ))}
        {props.submitButtonName && (
          <TextButton text={props.submitButtonName} type="submit" />
        )}
      </Form>
    </Formik>
  );
}
type FormikInputProps = {
  label?: string;
  inputName: string;
  formId?: string;
  validate?: any;
};

export function FormikInput(props: FormikInputProps & { inputId: string }) {
  return (
    <div>
      {props.label && <label>{props.label}</label>}
      <Field
        id={props.inputId}
        name={props.inputName}
        form={props.formId}
        validate={props.validate}
      />
      <ErrorMessage
        name={props.inputName}
        component="span"
        className={styles.error}
      />
    </div>
  );
}

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export function Input(props: InputProps) {
  return <input {...props} />;
}

export type TextInputProps = {
  /** The type of the input. If omitted, 'text' is used. */
  type?: "text" | "password" | "email";
  /** The current value being captured. */
  value: string;
  /** A function to be called when the input element is used to change the captured value. */
  onChange: (newValue: string) => void;
  /** A function to call when the user presses Enter while focused on the input element. Is passed the input element. */
  onEnter?: (trigger: Focusable) => void;
  /** A function to call when the input element loses focus. */
  onBlur?: (input: HTMLInputElement) => void;
  disabled?: boolean;
  readonly?: boolean;
  /** The style to use for this input. Defaults to 'standard'. Note that the 'bottom-line' style is deprecated and should not be used. */
  style?: "standard" | "bottom-line";
  /** If undefined, standard border is applied. 'no-right-border' allows us to combine the component to look visually adjacent to another on its right side. */
  borderStyle?: "standard" | "no-right-border";
  /** Optional class applied to the container of the control. Use for margins and positioning. */
  containerClassName?: string;
  /** The maximum length of the value being captured */
  maxLength?: number;
  placeholder?: string;
  /** The value to be assigned to the underlying input's aria-required attribute. This should be set to true for inputs that have required validation applied. */
  ariaRequired?: boolean;
  /** An optional ID of an element that contains guidance text that describes the input. The value will be assigned to the underlying input's aria-describedby attribute. */
  ariaDescribedBy?: string;
  includeSearchIcon?: boolean;
};

/** A basic modular textbox, includes default v6 styling. */
export function TextInput(props: TextInputProps) {
  return (
    <div className={classNames(styles.container, props.containerClassName)}>
      <Input
        className={classNames(styles.input, {
          [styles.noRightBorder]: props.borderStyle === "no-right-border",
          [styles.bottomLine]: props.style === "bottom-line",
          [styles.searchIconShown]: props.includeSearchIcon,
        })}
        disabled={props.disabled}
        readOnly={props.readonly}
        type={props.type ?? "text"}
        maxLength={props.maxLength}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        onBlur={(e) => props.onBlur?.(e.currentTarget)}
        placeholder={props.placeholder}
        aria-required={props.ariaRequired}
        aria-describedby={props.ariaDescribedBy}
        onKeyDown={
          props.onEnter
            ? (e) => {
                if (e.key === Key.Enter) {
                  e.preventDefault();
                  props.onEnter?.(e.target as HTMLInputElement);
                  //CODEREVIEW
                  console.log("jhdsgfjdsgf");
                }
              }
            : undefined
        }
      />
    </div>
  );
}
