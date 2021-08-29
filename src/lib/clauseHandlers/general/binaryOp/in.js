/* eslint-disable no-unused-vars */
import invariant from "invariant";
import {
  isNested,
  generateSpanChild,
  generateInputChild,
  getASTValue,
  assignAST,
} from "./../../../util";
import { constants } from "../../../../config/constants";
import { generateQueryComponent } from "../../../queryHandlers";

const { EXPR_TYPE, VALID_VALUE_TYPES, QUERY_TYPE } = constants;

export const inOp = (operator, left, right, component, children, nest) => {
  const expressionIsValid =
    left.type === EXPR_TYPE.COLUMN_REF && right.type === EXPR_TYPE.EXPR_LIST;

  invariant(
    expressionIsValid,
    `Unsupported binary expression 'IN' type pair: Left = ${left.type}, Right = ${right.type}`
  );

  children.push(
    generateInputChild({
      onChange: (e) => {
        assignAST(left, getASTValue(e.target.value));
        console.log(`IN left ${nest} updated`);
      },
    })
  );
  children.push(generateSpanChild(operator));

  // isNested uses a .some() on the right.value expression list array
  // this line really means "if at least one expression in the "IN" is nested"
  if (isNested(right.value)) {
    let hasOuterParen = false;
    if (Array.isArray(right.value) && right.value.length > 1) {
      children.push(generateSpanChild("(", { marginRight: "0px" }));
      hasOuterParen = true;
    }

    right.value.forEach((item, index) => {
      if (isNested(item)) {
        const subqueryComponentArr = right.value
          .map((item) => {
            if (!item) return undefined;

            return item.type === QUERY_TYPE.SELECT
              ? generateQueryComponent(item, component, nest + 1)
              : undefined;
          })
          .filter((item) => item !== undefined);

        children.push(generateSpanChild("("));
        children.push(...subqueryComponentArr);
        children.push(generateSpanChild(")", { marginRight: "0px" }));
        children.push(generateSpanChild(", ", { marginRight: "0px" }));
      } else {
        invariant(
          VALID_VALUE_TYPES[item.type],
          `Unsupported right value type for IN (..) call: ${item.type}`
        );

        children.push(
          generateInputChild({
            onChange: (e) => {
              const astValue = getASTValue(e.target.value);

              if (!VALID_VALUE_TYPES[astValue.type]) {
                throw new Error(
                  `Invalid type ${astValue.type} for value ${e.target.value} in 'IN right, nest ${nest}'`
                );
              }

              right.value[index] = astValue;

              console.log(`IN right nest ${nest} index ${index} updated`);
            },
          })
        );
        children.push(generateSpanChild(", ", { marginRight: "0px" }));
      }
    });

    // remove trailing comma and space
    children.pop();

    if (hasOuterParen) {
      children.push(generateSpanChild(")"));
    }
  } else {
    invariant(
      right.value.every((expr) => VALID_VALUE_TYPES[expr.type]),
      'Expression list for "IN" operator contains one or more values that are not strings, numbers, or booleans'
    );
    children.push(
      generateInputChild({
        onChange: (e) => {
          assignAST(right, getASTValue(e.target.value));
          console.log(`IN right, nest ${nest} updated`);
        },
      })
    );
  }
};
