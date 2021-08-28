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
    select: {
      from: handleFromClause,
      where: handleWhereClause,
      union: handleUnionClause,
      join: handleJoinClause,
    },
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
    // Join Clause
    if (from.length >= 2 && from[1][CLAUSE_TYPE.JOIN]) {
      // If second item in `from` has join item
      const joinObj = from[1];
      handleJoinClause(joinObj, component, children, nest);
    }
  }

  const where = queryObj[CLAUSE_TYPE.WHERE];
  if (where) {
    handleWhereClause(where, component, children, nest);
  }

  const union = queryObj[CLAUSE_TYPE.UNION];
  if (union) {
    // If union arg exists, append span+input and link to queryObj._next
    const nextQuery = queryObj._next;
    const nextCols = nextQuery.columns;
    handleUnionClause(union, component, children, nest);
    children.push(generateSpanChild("SELECT"));
    children.push(
      generateInputChild({
        onChange: (e) => {
          assignAST(nextCols, getASTArr(e.target.value));
          console.log(`select columns, nest ${nest} updated`);
        },
      })
    );
    const nextFrom = nextQuery[CLAUSE_TYPE.FROM];
    if (nextFrom) {
      handleFromClause(nextFrom, nextQuery, component, children, nest);
    }
    const nextWhere = nextQuery[CLAUSE_TYPE.WHERE];
    if (nextWhere) {
      handleWhereClause(nextWhere, component, children, nest);
    }
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
