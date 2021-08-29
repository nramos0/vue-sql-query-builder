import { constants } from "../../../config/constants";
import { cmp } from "./binaryOp/cmp";
import { log } from "./binaryOp/log";
import { inOp } from "./binaryOp/in";

const {
  OPERATORS: { CMP: CMP_OPERATORS, LOG: LOG_OPERATORS },
} = constants;

export const binaryOp = (obj, operator, component, children, nest) => {
  const { left, right } = obj;
  if (CMP_OPERATORS[operator]) {
    cmp(operator, left, right, component, children, nest);
  } else if (LOG_OPERATORS[operator]) {
    log(operator, left, right, component, children, nest);
  } else if (operator === "IN") {
    inOp(operator, left, right, component, children, nest);
  } else {
    console.error(`unhandled binary operator: ${operator}`);
  }
};
