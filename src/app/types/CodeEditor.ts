import { TokenLocation } from "../../ERDoc/types/parser/TokenLocation";

// from 'monaco-editor', importing it directly causes a conflict with SSR
export enum MarkerSeverity {
  Hint = 1,
  Info = 2,
  Warning = 4,
  Error = 8,
}

export type ErrorMessage = {
  errorMessage: string;
  location: TokenLocation;
};
