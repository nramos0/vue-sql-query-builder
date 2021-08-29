/* eslint-disable no-unused-vars */
import invariant from "invariant";
import {
  generateSpanChild,
  generateInputChild,
  assignAST,
  getASTArr,
} from "../util";
import { constants } from "../../config/constants";
import {
  selectFrom,
  selectWhere,
  selectJoin,
  selectUnion,
  selectHaving,
  selectGroupby,
  selectOrderby,
} from "../clauseHandlers";

const { CLAUSE_TYPE } = constants;

const handleFrom = (queryObj, component, children, nest) => {
  const from = queryObj[CLAUSE_TYPE.FROM];
  if (from) {
    selectFrom(from, component, children, nest);
    // Join Clause
    if (from.length >= 2 && from[1][CLAUSE_TYPE.JOIN]) {
      // If second item in `from` has join item
      const joinObj = from[1];
      selectJoin(joinObj, component, children, nest);
    }
  }
};

const handleWhere = (queryObj, component, children, nest) => {
  const where = queryObj[CLAUSE_TYPE.WHERE];
  if (where) {
    selectWhere(where, component, children, nest);
  }
};

const handleGroupby = (queryObj, component, children, nest) => {
  const groupby = queryObj[CLAUSE_TYPE.GROUPBY];
  if (groupby) {
    selectGroupby(groupby, component, children, nest);
  }
};

const handleHaving = (queryObj, component, children, nest) => {
  const having = queryObj[CLAUSE_TYPE.HAVING];
  if (having) {
    selectHaving(having, component, children, nest);
  }
};

const handleUnion = (queryObj, component, children, nest) => {
  const union = queryObj[CLAUSE_TYPE.UNION];
  if (union) {
    // If union arg exists, append span+input and link to queryObj._next
    const nextQuery = queryObj._next;
    const nextCols = nextQuery.columns;
    selectUnion(union, component, children, nest);
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
      selectFrom(nextFrom, component, children, nest);
    }
    const nextWhere = nextQuery[CLAUSE_TYPE.WHERE];
    if (nextWhere) {
      selectWhere(nextWhere, component, children, nest);
    }
  }
};

const handleOrderby = (queryObj, component, children, nest) => {
  const orderby = queryObj[CLAUSE_TYPE.ORDERBY];
  if (orderby) {
    selectOrderby(orderby, component, children, nest);
  }
};

export const selectQuery = (queryObj, component, children, nest) => {
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

  // reference for correct order
  // https://www.postgresql.org/docs/13/sql-select.html
  [
    handleFrom,
    handleWhere,
    handleGroupby,
    handleHaving,
    handleUnion,
    handleOrderby,
  ].forEach((fn) => fn(queryObj, component, children, nest));
};
