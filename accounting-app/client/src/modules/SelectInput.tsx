import * as React from "react";
import { classNames, Focusable, toDictionary } from ".";
import { Labelled } from ".";
import styles from "./SelectInput.module.scss";

export type SelectInputOption<TOptionId extends string | number> = {
  id: TOptionId;
  name: string;
  helpText?: string;
  disabled?: boolean;
};

export type SelectInputOptionGroup<TOptionId extends string | number> = {
  groupLabel: string;
  options: SelectInputOption<TOptionId>[];
};

/**
 * Helper function to transform an array of items into a series of (grouped) dropdown options.
 * Items which transform into options with the same groupLabel will be grouped, and items with an
 * undefined grouplabel will be appended to the end as default.
 * Use the {@link grouplessAtBeginning} parameter to instruct the groupless options be returned first.
 */
export function groupSelectInputOptions<
  TItem,
  TOptionId extends string | number
>(
  items: TItem[],
  transform: (
    item: TItem
  ) => SelectInputOption<TOptionId> & { groupLabel: string | null },
  grouplessAtBeginning?: boolean
) {
  // We'll put option groups in this array as we encounter them...
  const optionGroups: SelectInputOptionGroup<TOptionId>[] = [];
  // ...and we'll put options without groups in this array, then combine the arrays at the end.
  const grouplessOptions: SelectInputOption<TOptionId>[] = [];
  items.forEach((item) => {
    const option = transform(item);
    if (option.groupLabel === null) {
      grouplessOptions.push(option);
    } else {
      let group = optionGroups.find((g) => g.groupLabel === option.groupLabel);
      // If we haven't seen this group yet then we need to create it
      if (group === undefined) {
        group = {
          groupLabel: option.groupLabel,
          options: [],
        };
        optionGroups.push(group);
      }
      group.options.push(option);
    }
  });

  return grouplessAtBeginning
    ? [...grouplessOptions, ...optionGroups]
    : [...optionGroups, ...grouplessOptions];
}

export type SelectInputProps<TOptionId extends string | number> = {
  /** The options to offer inside the dropdown. If the ids of options are strings, they must not use the empty string. */
  options: (SelectInputOption<TOptionId> | SelectInputOptionGroup<TOptionId>)[];

  /** The label to use for the empty option. If this is undefined then no empty option will be included. */
  emptyOptionText?: string;

  /** The help text to use for the empty option. If this is undefined, no help text will be included. */
  emptyOptionHelpText?: string;

  /** The current value of the dropdown - null if the empty option should be selected. */
  value: TOptionId | null;

  /** A function to call when the value of the dropdown changes - null will be passed if the empty option is selected. */
  onChange: (newValue: TOptionId | null, element: Focusable) => void;

  disabled?: boolean;

  /** Instruct the select element to stretch to the width of the container (default) or fit its contents. */
  width?: "stretch" | "fit-content";

  /** The value to be assigned to the underlying input's aria-required attribute. This should be set to true for inputs that have required validation applied. */
  ariaRequired?: boolean;
  /** An optional ID of an element that contains guidance text that describes the input. The value will be assigned to the underlying button's aria-describedby attribute. */
  ariaDescribedBy?: string;
  /** Allow for id and ariaLabel through the standard labelled framework. */
  labelled: Exclude<Labelled.Union, Labelled.AriaLabelledBy>;

  /** This ref will be assigned to the rendered <select> element if provided. */
  selectRef?: React.Ref<HTMLSelectElement>;
  /** Optional content to include to the right of the <select> element. This is expected to be small, e.g. an icon. */
  contentAfterControl?: React.ReactNode;
};

/** Type guard checks if the supplied option or option group is an option group. */
function isOptionGroup<TOptionId extends string | number>(
  optionOrGroup:
    | SelectInputOption<TOptionId>
    | SelectInputOptionGroup<TOptionId>
): optionOrGroup is SelectInputOptionGroup<TOptionId> {
  return (
    (optionOrGroup as SelectInputOptionGroup<TOptionId>).options !== undefined
  );
}

// Returns a string representing the provided id, whether it be a string or a number
function idToString<TOptionId extends string | number>(id: TOptionId) {
  return typeof id === "number" ? id.toString() : id;
}

/** Renders a single option. */
function SelectInputOption<TOptionId extends string | number>(props: {
  option: SelectInputOption<TOptionId>;
}) {
  return (
    <option
      className={styles.option}
      value={idToString(props.option.id)}
      disabled={props.option.disabled}
    >
      {props.option.name}
    </option>
  );
}

export function SelectInput<TOptionId extends string | number>(
  props: SelectInputProps<TOptionId>
) {
  const emptyOptionStringValue = "";
  const labelled = Labelled.toIntersection(props.labelled);

  /** A dictionary mapping the string value of all option IDs to the options themselves. */
  const optionsByStringId = React.useMemo(
    () =>
      toDictionary(
        props.options.reduce(
          (soFar, current) =>
            soFar.concat(isOptionGroup(current) ? current.options : [current]),
          [] as SelectInputOption<TOptionId>[]
        ),
        (option) => idToString(option.id)
      ),
    [props.options]
  );

  // FUTURE - Should this component blow up if value is not in the set of options?
  const helpText =
    props.value !== null
      ? optionsByStringId[props.value]?.helpText
      : props.emptyOptionHelpText;

  return (
    <div>
      <div className={styles.selectContainer}>
        <select
          id={labelled.id}
          ref={props.selectRef}
          className={classNames(
            styles.select,
            props.width === "fit-content" ? styles.fitContent : styles.stretch
          )}
          value={props.value === null ? emptyOptionStringValue : props.value}
          onChange={(e) =>
            props.onChange(
              e.currentTarget.value === emptyOptionStringValue
                ? null
                : optionsByStringId[e.currentTarget.value].id,
              e.currentTarget
            )
          }
          disabled={props.disabled}
          aria-label={labelled.ariaLabel}
          aria-required={props.ariaRequired}
          aria-describedby={props.ariaDescribedBy}
        >
          {props.emptyOptionText !== undefined && (
            <option value={emptyOptionStringValue}>
              {props.emptyOptionText}
            </option>
          )}
          {props.options.map((optionOrGroup, index) =>
            isOptionGroup(optionOrGroup) ? (
              <optgroup key={index} label={optionOrGroup.groupLabel}>
                {optionOrGroup.options.map((option, optionIndex) => (
                  <SelectInputOption key={optionIndex} option={option} />
                ))}
              </optgroup>
            ) : (
              <SelectInputOption key={index} option={optionOrGroup} />
            )
          )}
        </select>
        {props.contentAfterControl}
      </div>
      {helpText &&
        // disabled text supersedes help text
        !props.disabled && (
          <div className={styles.helpText} aria-live="polite">
            {helpText}
          </div>
        )}
    </div>
  );
}
