const whereHavingAllowedOps = [
  "IN",
  "=",
  "!=",
  "<>",
  ">",
  "<",
  "<=",
  ">=",
  "AND",
  "OR",
  "NOT",
];

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
  },

  QUERY_TYPE: {
    SELECT: "select",
  },

  SUPPORTED_OPERATORS: {
    SELECT: {
      WHERE: whereHavingAllowedOps,
      HAVING: whereHavingAllowedOps,
    },
  },

  OPERATORS: {
    CMP: {
      "=": true,
      "!=": true,
      "<>": true,
      ">": true,
      "<": true,
      "<=": true,
      ">=": true,
    },
    LOG: { AND: true, OR: true, NOT: true },
  },

  VALID_VALUE_TYPES: [],
};

constants.VALID_VALUE_TYPES.push(
  constants.EXPR_TYPE.NUMBER,
  constants.EXPR_TYPE.VALUE_STR,
  constants.EXPR_TYPE.BOOL,
  constants.EXPR_TYPE.UNARY_EXPR
);

export { constants };
