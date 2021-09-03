/* eslint-disable no-unused-vars */
import {
  generateSpanChild,
  generateInputChild,
  setAST_Join,
  setAST_On,
} from "../../util";

export const selectJoin = (joinObj, component, children, nest) => {
  // joinObj = from.at(-1)
  // TODO Maybe add some error checking
  children.push(generateSpanChild(joinObj["join"]));
  children.push(
    generateInputChild({
      onChange: (e) => {
        setAST_Join(joinObj, e.textInput);
        console.log(`clause value nest ${nest} updated`);
      },
    })
  );
  if (joinObj["on"]) {
    const onObj = joinObj["on"];
    children.push(generateSpanChild("ON"));
    children.push(
      generateInputChild({
        onChange: (e) => {
          setAST_On(onObj, e.textInput);
          console.log(`clause value nest ${nest} updated`);
        },
      })
    );
  }
};
