/* eslint-disable no-unused-vars */
import invariant from "invariant";
import { generateSpanChild, generateInputChild, getASTValue } from "../../util";
import { constants } from "../../../config/constants";

const { EXPR_TYPE, VALID_VALUE_TYPES } = constants;

export const unaryOp = (value, component, children, nest) => {
  value.operator = value.operator.toUpperCase();
  const { operator } = value;

  const isColumnRef = value.type === EXPR_TYPE.COLUMN_REF;
  const expressionIsValid = isColumnRef || VALID_VALUE_TYPES[value.type];

  invariant(
    expressionIsValid,
    `Unsupported unary expression type ${value.type}`
  );

  children.push(generateSpanChild(operator));
  children.push(
    generateInputChild({
      onChange: (e) => {
        const astValue = getASTValue(e.target.value);

        if (
          astValue.type !== EXPR_TYPE.COLUMN_REF &&
          !VALID_VALUE_TYPES[astValue.type]
        ) {
          throw new Error(
            `Invalid type ${astValue.type} for value ${value} in 'unary op nest ${nest}'`
          );
        }
        value.expr = astValue;

        console.log(`unary op nest ${nest} updated`);
      },
    })
  );
};
