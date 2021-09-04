import { generateSpanChild } from "../../util";
import { value } from "../general";

export const selectGroupby = (having, component, children, nest) => {
  children.push(generateSpanChild("GROUP BY"));
  value(having, component, children, nest);
};
