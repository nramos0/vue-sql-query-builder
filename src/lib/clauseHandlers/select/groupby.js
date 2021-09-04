import {
    generateSpanChild,
    generateInputChild,
    setAST_GroupBy,
} from "../../util";
//import { value } from "../general";

export const selectGroupby = (having, component, children, nest) => {
    children.push(generateSpanChild("GROUP BY"));
    // value(having, component, children, nest);
    children.push(
        generateInputChild({
            onChange: (e) => {
                setAST_GroupBy(having, e.textInput);
                console.log(`clause value nest ${nest} updated`);
            },
        })
    );
};