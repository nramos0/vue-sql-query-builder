/* eslint-disable no-unused-vars */
import invariant from "invariant";
import {
  generateSpanChild,
  generateInputChild,
  getASTValue,
  assignAST,
} from "./../../../util";
import { constants } from "../../../../config/constants";

const { EXPR_TYPE, VALID_VALUE_TYPES } = constants;

export const whereCmp = (operator, left, right, component, children, nest) => {
  const leftIsColumn = left.type === EXPR_TYPE.COLUMN_REF;
  const rightIsColumn = right.type === EXPR_TYPE.COLUMN_REF;

  const expressionIsValid =
    (leftIsColumn || rightIsColumn) &&
    VALID_VALUE_TYPES.some(
      (validType) => left.type === validType || right.type === validType
    );

  invariant(
    expressionIsValid,
    `Unsupported WHERE binary expression '${operator}' type pair: Left = ${left.type}, Right = ${right.type}`
  );

  let leftToAssign = left;
  if (left.type === EXPR_TYPE.UNARY_EXPR) {
    children.push(generateSpanChild(left.operator));
    leftToAssign = left.expr;
  }

  children.push(
    generateInputChild({
      onChange: (e) => {
        assignAST(leftToAssign, getASTValue(e.target.value));
        console.log(`where cmp ${operator} left ${nest} updated`);
      },
    })
  );

  children.push(generateSpanChild(operator));

  let rightToAssign = right;
  if (right.type === EXPR_TYPE.UNARY_EXPR) {
    children.push(generateSpanChild(right.operator));
    rightToAssign = right.expr;
  }

  children.push(
    generateInputChild({
      onChange: (e) => {
        assignAST(rightToAssign, getASTValue(e.target.value));
        console.log(`where cmp ${operator} right ${nest} updated`);
      },
    })
  );
};
