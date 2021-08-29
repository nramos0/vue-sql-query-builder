import { generateSpanChild } from "../../util";
import { boolExpr } from "../general/boolExpr";

export const selectHaving = (having, component, children, nest) => {
  children.push(generateSpanChild("HAVING"));
  boolExpr(having, component, children, nest);
};
