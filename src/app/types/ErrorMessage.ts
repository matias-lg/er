import { TokenLocation } from "../../ERDoc/types/parser/TokenLocation";

export type ErrorMessage = {
  errorMessage: string;
  location: TokenLocation
};