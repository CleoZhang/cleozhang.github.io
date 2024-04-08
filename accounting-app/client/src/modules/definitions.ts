export type IdWithDisplayName = {  id: number,  name: string };
export type DefObject = IdWithDisplayName & { shortname?: string, categoryId?: number };

export type Focusable = {
    focus: () => void;
  };

  /** An enum describing values returned by the 'key' property of key events. */
export enum Key {
	// Note that alphabetic character keys are different depending on whether CapsLock is on. E.g. 'a' vs 'A'.
	ArrowDown = 'ArrowDown',
	ArrowLeft = 'ArrowLeft',
	ArrowRight = 'ArrowRight',
	ArrowUp = 'ArrowUp',
	Backspace = 'Backspace',
	Delete = 'Delete',
	End = 'End',
	Enter = 'Enter',
	Escape = 'Escape',
	Home = 'Home',
	PageDown = 'PageDown',
	PageUp = 'PageUp',
	Space = ' ',
	Tab = 'Tab'
}