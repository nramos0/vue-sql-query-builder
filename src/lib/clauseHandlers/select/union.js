/* eslint-disable no-unused-vars */
import { generateSpanChild } from "../../util";

export const selectUnion = (where, component, children, nest) => {
  children.push(generateSpanChild("UNION"));
};
