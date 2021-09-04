import {
  generateSpanChild,
  generateInputChild,
  setAST_OrderBy,
} from "../../util";
// import { value } from "../general";

export const selectOrderby = (having, component, children, nest) => {
  children.push(generateSpanChild("ORDER BY"));
  // value(having, component, children, nest);
  children.push(
    generateInputChild({
      onChange: (e) => {
        setAST_OrderBy(having, e.textInput);
        console.log(`clause value nest ${nest} updated`);
      },
    })
  );
  children.push(generateSpanChild(having[0].type));
};
