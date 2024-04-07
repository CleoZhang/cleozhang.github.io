export type DisplayName = { name: string };
export type DisplayNames = DisplayName & { shortname: string };
export type Id = { id: number }; 
export type IdWithDisplayName = Id & DisplayName;
export type IdWithDisplayNames = Id & DisplayNames;

export type Focusable = {
    focus: () => void;
  };
