import { generateSpanChild } from "../../util";
import { value } from "../general";

export const selectOrderby = (having, component, children, nest) => {
  children.push(generateSpanChild("ORDER BY"));
  value(having, component, children, nest);
};
