import { generateSpanChild } from "../../util";
import { boolExpr } from "../general/boolExpr";

export const selectWhere = (where, component, children, nest) => {
  children.push(generateSpanChild("WHERE"));
  boolExpr(where, component, children, nest);
};
