import invariant from "invariant";
import { constants } from "../../../config/constants";
import { binaryOp } from "./binaryOp";
import { unaryOp } from "./unaryOp";
import { value } from "./value";

const { EXPR_TYPE, VALID_VALUE_TYPES } = constants;

export const boolExpr = (obj, component, children, nest) => {
  const { type } = obj;

  invariant(
    type === EXPR_TYPE.BINARY_EXPR || VALID_VALUE_TYPES[type],
    `Unsupported boolean expression type: ${type}`
  );

  if (type !== EXPR_TYPE.BINARY_EXPR && type !== EXPR_TYPE.UNARY_EXPR) {
    value(obj, component, children, nest);
  } else {
    // certainly an expression with an operator
    if (type === EXPR_TYPE.BINARY_EXPR) {
      binaryOp(obj, component, children, nest);
    } else if (type === EXPR_TYPE.UNARY_EXPR) {
      // NOT is the only unary operator in SUPPORTED_OPERATORS, so operator === 'NOT' is surely true
      unaryOp(obj, component, children, nest);
    }
  }
};
