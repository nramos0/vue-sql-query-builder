/* eslint-disable no-unused-vars */
import {
  generateSpanChild,
  generateInputChild,
  getAllColumns,
  setAST_Join,
  setAST_On,
} from "../../util";

export const selectJoin = (queryObj, component, children, nest) => {
  // TODO Maybe add some error checking

  const joinObj = queryObj.from.at(-1);

  children.push(generateSpanChild(joinObj["join"]));
  children.push(
    generateInputChild({
      onChange: (e) => {
        setAST_Join(joinObj, e.textInput);
        console.log(`clause value nest ${nest} updated`);
      },
      onFocus: (e) => {
        // get the container vue object
        const datacontainer = e.$store.getters.datacontainer;

        // update suggestions
        e.setSuggestions(datacontainer.getTables());
      },
      inputType: "join",
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
        onFocus: (e) => {
          // get the datacontainer vue object
          const datacontainer = e.$store.getters.datacontainer;

          //get columns
          const columns = getAllColumns(queryObj, datacontainer);

          // update suggestions
          e.setSuggestions(columns);
        },
        inputType: "on",
      })
    );
  }
};
