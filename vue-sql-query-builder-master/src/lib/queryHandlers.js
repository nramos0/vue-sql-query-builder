/* eslint-disable no-unused-vars */
import invariant from "invariant";
import { clauseHandlers } from "./clauseHandlers";
import {
  generateSpanChild,
  generateInputChild,
  assignAST,
  getASTArr,
} from "./util";
import { constants } from "../config/constants";

const { QUERY_TYPE, CLAUSE_TYPE, EXPR_TYPE } = constants;

const select = (queryObj, component, children, nest) => {
    const {
        select: { from: handleFromClause, where: handleWhereClause, having: handleHavingClause, order_by: handleOrderByClause, group_by: handleGroupByClause, },
  } = clauseHandlers;

  const cols = queryObj.columns;

  invariant(cols !== undefined, "Columns don't exist on queryObj");
  invariant(Array.isArray(cols), "Columns is not an array");

  children.push(generateSpanChild("SELECT"));
  children.push(
    generateInputChild({
      onChange: (e) => {
        assignAST(cols, getASTArr(e.target.value));
        console.log(`select columns, nest ${nest} updated`);
      },
    })
  );

  const from = queryObj[CLAUSE_TYPE.FROM];
  if (from) {
    handleFromClause(from, queryObj, component, children, nest);
  }

  const where = queryObj[CLAUSE_TYPE.WHERE];
  if (where) {
    handleWhereClause(where, component, children, nest);
  }

    const having = queryObj[CLAUSE_TYPE.HAVING];
    if (having) {
        console.log("having");
        handleHavingClause(having, component, children, nest);
    }

    const group_by = queryObj[CLAUSE_TYPE.GROUP_BY];
    if (group_by) {
        console.log("group by");
        handleGroupByClause(group_by, component, children, nest);
    }

    const order_by = queryObj[CLAUSE_TYPE.ORDER_BY];
    if (order_by) {
        handleOrderByClause(order_by, component, children, nest);
    }
};

const queryHandlers = {
  select,
};

const generateQueryComponent = (queryObj, component, nest = 0) => {
  const { select } = queryHandlers;

  const children = [];
  switch (queryObj.type) {
    case QUERY_TYPE.SELECT:
      select(queryObj, component, children, nest);
      break;
    default:
      throw new Error(`unsupported queryObj type: ${queryObj.type}`);
  }

  const returnAST = false;

  return returnAST
    ? (h) => <pre>{JSON.stringify(queryObj, null, 4)}</pre>
    : (h) => (
        <p style={{ marginLeft: `${nest === 0 ? 0 : 20}px` }}>
          {children.map((child, index) => child(h, index))}
        </p>
      );
};

export { generateQueryComponent };
