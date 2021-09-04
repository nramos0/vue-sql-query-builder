/* eslint-disable no-unused-vars */
import { constants } from "../config/constants";
import { selectQuery } from "./queryHandlers/select";

const { QUERY_TYPE } = constants;

const generateQueryComponent = (queryObj, component, nest = 0) => {
  const children = [];
  switch (queryObj.type) {
    case QUERY_TYPE.SELECT:
      selectQuery(queryObj, component, children, nest);
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
