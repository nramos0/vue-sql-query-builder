/* eslint-disable no-unused-vars */
import { generateInputChild, getASTValue, assignAST } from "../../util";

export const value = (value, component, children, nest) => {
  children.push(
    generateInputChild({
      onChange: (e) => {
        assignAST(value, getASTValue(e.target.value));
        console.log(`clause value nest ${nest} updated`);
      },
    })
  );
};
