/* eslint-disable no-unused-vars */
import { generateInputChild, getASTValue, assignAST } from "../../util";

export const value = (value, component, children, nest, name = null) => {
  children.push(
    generateInputChild({
      onChange: (e) => {
        assignAST(value, getASTValue(e.textInput));
        console.log(`${name ? `${name}` : "value"} nest ${nest} updated`);
      },
    })
  );
};
