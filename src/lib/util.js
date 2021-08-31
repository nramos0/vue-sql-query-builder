/* eslint-disable no-unused-vars */
import { Parser } from "node-sql-parser";
import { constants } from "../config/constants";
import Dropdown from "../components/Dropdown";

export const parser = new Parser();

// note that bool must be parsed last, since its display placeholder '...' has no
// empty character after like the other value types do, so if its placeholders
// were to be replaced before the others, it would overwrite all other remaining
// placeholders and leave empty unicode character remnants over
const valueTypes = ["COL_REF", "NUM", "STR", "BOOL"];

const parseModelString = (str) => {
  return valueTypes.reduce(
    (returnStr, nextValueType) =>
      returnStr.replaceAll(
        constants.QUERY_MODEL.DISPLAY_PLACEHOLDER[nextValueType],
        constants.QUERY_MODEL.PARSE_PLACEHOLDER[nextValueType]
      ),
    str
  );
};

const generateSpanChild = (text, style, newlineBefore, newlineAfter) => {
  return (h, key) => (
    <span key={key} style={style}>
      {newlineBefore && <br />}
      {text}
      {newlineAfter && <br />}
    </span>
  );
};

const efn = () => {};

const generateInputChild = (
  { onChange = efn, onFocus = efn, onBlur = efn } = {
    onChange: efn,
    onBlur: efn,
    onFocus: efn,
  }
) => {
  // changes on-_ to propOn_
  return (h, key) => (
    <Dropdown
      class="queryInput"
      key={key}
      propOnChange={onChange}
      propOnFocus={onFocus}
      propOnBlur={onBlur}
    ></Dropdown>
  );
};

const getOnFocus = (component, setNestedAST) => (e) => {
  component.setNestedAST = setNestedAST;
  console.log("did focus", e);

  // update the suggestions for FROM
  // get the container vue object
  const datacontainer = e.$parent.$refs.datacontainer;

  // update suggestions
  e.setSuggestions(datacontainer.getTables());
};

const getOnBlur = (component, setNestedAST) => (e) => {
  // blur on a timeout, otherwise clicking a model button after focusing an input
  // would cause the input to be blurred before the model button onClick fires,
  // which means that by the time the onClick fires to nest the model into the
  // current input, setNestedAST would already be null in the case with no timeout
  setTimeout(() => {
    if (component.setNestedAST === setNestedAST) {
      component.setNestedAST = null;
      console.log("did blur", e);
    } else {
      console.log(
        "tried to blur",
        e,
        "but something else already overwrote setNestedAST"
      );
    }
  }, 500);
};

const getOnFocusAndOnBlur = (component, setNestedAST) => {
  return {
    onFocus: getOnFocus(component, setNestedAST),
    onBlur: getOnBlur(component, setNestedAST),
  };
};

const isNested = (arr) => {
  if (typeof arr !== "object") {
    throw new Error(`Non-object parameter passed to isNested: ${arr}`);
  }

  if (!Array.isArray(arr)) {
    arr = [arr];
  }

  return arr.some(
    (item) =>
      item.type === constants.QUERY_TYPE.SELECT || (item.expr && item.expr.ast)
  );
};

const parseSelectValue = (value) => {
  return parser.astify(`SELECT ${value}`);
};

const getASTValue = (value) => {
  return parseSelectValue(value).columns[0].expr;
};

const getASTArr = (value) => {
  return parseSelectValue(value).columns;
};

const getASTTable = (value) => {
  return parser.astify(`SELECT * FROM ${value}`).from;
};

const assignAST = (obj, ast, i = 0) => {
  // Changed parameters, if type(obj)=type(ast)=Array then must pass in its index `i`
  if (Array.isArray(obj)) {
    // Join has two items in array 'from', both gets deleted when changing FROM clause, which caused error
    // TODO: Might find a better way to do this
    obj = obj[i];
    ast = ast[i];
  }
  for (const prop in obj) {
    delete obj[prop];
  }
  Object.assign(obj, ast);
};

// AST for join statement is slightly different

const parseJoin = (join, on) => {
  const c_temp = constants.QUERY_MODEL.PARSE_PLACEHOLDER["COL_REF"];
  // if null set to parse placeholder
  join = join ? join : c_temp;
  on = on ? on : c_temp;
  return parser.astify(`SELECT ${c_temp} FROM ${c_temp} JOIN ${join} ON ${on}`);
};

const setAST_Join = (joinObj, join) => {
  // join is text inside inputbox
  const ast_join = parseJoin(join, null).from[1];
  // joinObj has items db, as, join (already set = inner/l/r join), on (no access), table
  // replace everything except on (dont have access to on, therefore its only a placeholder)
  joinObj.db = ast_join.db;
  joinObj.as = ast_join.as;
  joinObj.table = ast_join.table;
};

const setAST_On = (onObj, on) => {
  // on is text inside inputbox
  const ast_on = parseJoin(null, on).from[1].on;
  // similar to setAST_Join, except only have `on`
  // can replace everything inside on
  assignAST(onObj, ast_on);
};

export {
  parseModelString,
  generateInputChild,
  generateSpanChild,
  isNested,
  getASTValue,
  getASTArr,
  getASTTable,
  setAST_Join,
  setAST_On,
  assignAST,
  getOnFocus,
  getOnBlur,
  getOnFocusAndOnBlur,
};
