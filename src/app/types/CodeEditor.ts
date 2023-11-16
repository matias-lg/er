import { ER } from "../../ERDoc/types/parser/ER";
import { TokenLocation } from "../../ERDoc/types/parser/TokenLocation";
import { ErJSON } from "../hooks/useJSON";

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

type ErEventPositions = {
  nodes: ErJSON["nodes"];
  edges: ErJSON["edges"];
};

export type ErDocChangeEvent =
  | {
      type: "userInput";
      er: ER;
    }
  | {
      type: "json";
      positions: ErEventPositions;
    }
  | {
      type: "localStorage";
      positions: ErEventPositions;
    };
