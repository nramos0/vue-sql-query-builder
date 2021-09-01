import { generateQueryComponent } from "../../queryHandlers";
import {
  isNested,
  generateSpanChild,
  generateInputChild,
  getASTTable,
  assignAST,
  getOnFocusAndOnBlur,
} from "../../util";

export const selectFrom = (from, component, children, nest) => {
  children.push(generateSpanChild("FROM"));

  if (isNested(from)) {
    // nested
    const subqueryComponentArr = from
      .map((item) => {
        return item.expr?.ast
          ? generateQueryComponent(item.expr.ast, component, nest + 1)
          : undefined;
      })
      .filter((item) => item !== undefined);

    children.push(generateSpanChild("("));
    // note that generateQueryComponent always returns a block-level <p>,
    // so every element inside subqueryComponentArr will start on its own line
    children.push(...subqueryComponentArr);
    children.push(generateSpanChild(")"));
  } else {
    // not nested
    children.push(
      generateInputChild({
        onChange: (e) => {
          assignAST(from, getASTTable(e.textInput));
          console.log(`select from, nest ${nest}`);
        },
        ...getOnFocusAndOnBlur(component, (newQueryObj) => {
          assignAST(from, [
            {
              as: null,
              expr: {
                ast: newQueryObj,
              },
            },
          ]);
        }),
        inputType: "from",
      })
    );
  }
};
