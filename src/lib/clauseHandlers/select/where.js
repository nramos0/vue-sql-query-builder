import invariant from "invariant";
import { generateSpanChild } from "../../util";
import { constants } from "../../../config/constants";
import { value } from "../general/value";
import { whereCmp } from "./where/cmp";
import { whereLog } from "./where/log";
import { whereIn } from "./where/in";
import { unaryOp } from "../general/unaryOp";

const {
  EXPR_TYPE,
  VALID_VALUE_TYPES,
  SUPPORTED_OPERATORS: {
    SELECT: { WHERE: WHERE_SUPPORTED_OPERATORS },
  },
  OPERATORS: { CMP: CMP_OPERATORS, LOG: LOG_OPERATORS },
} = constants;

export const selectWhere = (
  where,
  component,
  children,
  nest,
  pushWhere = true
) => {
  if (pushWhere) {
    children.push(generateSpanChild("WHERE"));
  }

  const { type } = where;

  invariant(
    type === EXPR_TYPE.BINARY_EXPR || VALID_VALUE_TYPES.includes(type),
    `Unsupported WHERE expression type: ${type}`
  );

  if (type !== EXPR_TYPE.BINARY_EXPR && type !== EXPR_TYPE.UNARY_EXPR) {
    value(where, component, children, nest);
  } else {
    // certainly an expression with an operator

    // ensure alphabetic operators are always upper-case by convention
    where.operator = where.operator.toUpperCase();

    const { operator } = where;

    invariant(
      WHERE_SUPPORTED_OPERATORS.some((supportedOp) => supportedOp === operator),
      `Unsupported WHERE expression operator: ${operator}`
    );

    if (type === EXPR_TYPE.BINARY_EXPR) {
      const { left, right } = where;
      if (CMP_OPERATORS[operator]) {
        whereCmp(operator, left, right, component, children, nest);
      } else if (LOG_OPERATORS[operator]) {
        whereLog(operator, left, right, component, children, nest);
      } else if (operator === "IN") {
        whereIn(operator, left, right, component, children, nest);
      } else {
        console.error(`unhandled operator for SELECT ... WHERE: ${operator}`);
      }
    } else if (type === EXPR_TYPE.UNARY_EXPR) {
      // NOT is the only unary operator in SUPPORTED_OPERATORS, so operator === 'NOT' is surely true
      unaryOp(operator, where, component, children, nest);
    }
  }
};
