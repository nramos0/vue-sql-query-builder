/* eslint-disable no-unused-vars */
import invariant from "invariant";
import { generateSpanChild } from "./../../../util";
import { constants } from "../../../../config/constants";
import { selectWhere } from "../where";

const { EXPR_TYPE } = constants;

export const whereLog = (operator, left, right, component, children, nest) => {
  const expressionIsValid =
    left.type === EXPR_TYPE.BINARY_EXPR && right.type === EXPR_TYPE.BINARY_EXPR;

  invariant(
    expressionIsValid,
    `Unsupported logical operator ${operator} type pair: ${left.type} ${operator} ${right.type}`
  );

  selectWhere(left, component, children, nest, false);
  children.push(generateSpanChild(operator));
  selectWhere(right, children, children, nest, false);
};
