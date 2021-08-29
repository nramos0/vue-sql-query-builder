const constants = {
  QUERY_MODEL: {
    DISPLAY_PLACEHOLDER: {
      COL_REF: "...\u0000",
      NUM: "...\uFEFF",
      STR: "...\u2028",
      BOOL: "...",
    },
    PARSE_PLACEHOLDER: {
      COL_REF: "col",
      NUM: "0",
      STR: "'a'",
      BOOL: "true",
    },
  },

  EXPR_TYPE: {
    BINARY_EXPR: "binary_expr",
    UNARY_EXPR: "unary_expr",
    COLUMN_REF: "column_ref",
    EXPR_LIST: "expr_list",
    NUMBER: "number",
    BOOL: "bool",
    VALUE_STR: "single_quote_string",
    IDENT_STR: "string",
  },

  CLAUSE_TYPE: {
    FROM: "from",
    WHERE: "where",
    UNION: "union",
    JOIN: "join",
    HAVING: "having",
    GROUPBY: "groupby",
    ORDERBY: "orderby",
  },

  QUERY_TYPE: {
    SELECT: "select",
  },

  SUPPORTED_OPERATORS: {
    BOOL_EXPR: {
      IN: 1,
      "=": 1,
      "!=": 1,
      "<>": 1,
      ">": 1,
      "<": 1,
      "<=": 1,
      ">=": 1,
      AND: 1,
      OR: 1,
      NOT: 1,
    },
  },

  OPERATORS: {
    CMP: {
      "=": 1,
      "!=": 1,
      "<>": 1,
      ">": 1,
      "<": 1,
      "<=": 1,
      ">=": 1,
    },
    LOG: { AND: 1, OR: 1, NOT: 1 },
  },

  VALID_VALUE_TYPES: {},
};

// there is probably a more idomatic way to do this
const { EXPR_TYPE } = constants;
[
  EXPR_TYPE.NUMBER,
  EXPR_TYPE.VALUE_STR,
  EXPR_TYPE.BOOL,
  EXPR_TYPE.UNARY_EXPR,
].forEach((type) => {
  constants.VALID_VALUE_TYPES[type] = 1;
});

export { constants };
