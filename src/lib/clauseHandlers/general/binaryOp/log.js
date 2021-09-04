/* eslint-disable no-unused-vars */
import invariant from "invariant";
import { generateSpanChild } from "./../../../util";
import { constants } from "../../../../config/constants";
import { binaryOp } from "../binaryOp";

const { EXPR_TYPE } = constants;

export const log = (operator, left, right, component, children, nest) => {
  const expressionIsValid =
    left.type === EXPR_TYPE.BINARY_EXPR && right.type === EXPR_TYPE.BINARY_EXPR;

  invariant(
    expressionIsValid,
    `Unsupported logical operator ${operator} type pair: ${left.type} ${operator} ${right.type}`
  );

  binaryOp(left, component, children, nest);
  children.push(generateSpanChild(operator));
  binaryOp(right, component, children, nest);
};
