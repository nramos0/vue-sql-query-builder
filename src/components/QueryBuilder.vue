<script>
/* eslint-disable no-unused-vars */
import KeywordButton from "./KeywordButton.vue";
import Dropdown from "./Dropdown.vue";
import DataContainer from "./DataContainer.vue";
import { parseModelString, parser } from "../lib/util";
import { generateQueryComponent } from "../lib/queryHandlers";
import { constants } from "../config/constants";

export default {
  name: "QueryBuilder",
  components: {
    KeywordButton,
    Dropdown,
    DataContainer,
  },
  data() {
    // short names to reduce model length
    const {
      COL_REF: c,
      NUM: n,
      STR: s,
      BOOL: b,
    } = constants.QUERY_MODEL.DISPLAY_PLACEHOLDER;

    return {
      models: [
        `SELECT ${c}`,
        `SELECT ${c} FROM ${c}`,
        `SELECT ${c} FROM (SELECT ${c} FROM ${c})`,
        `SELECT ${c} FROM ${c} WHERE (NOT ${c})`,
        `SELECT ${c} FROM ${c} WHERE true`,
        `SELECT ${c} FROM ${c} WHERE ${c} = ${s}`,
        `SELECT ${c} FROM ${c} WHERE ${c} != ${b}`,
        `SELECT ${c} FROM ${c} WHERE ${c} = ${s} AND ${c} != ${s} OR ${c} = (NOT ${c})`,
        `SELECT ${c} FROM ${c} WHERE ${c} IN (${n})`,
        `SELECT ${c} FROM ${c} WHERE ${c} IN (SELECT ${c} FROM ${c})`,
        `SELECT ${c} FROM ${c} WHERE ${c} IN ((SELECT ${c} FROM ${c}), ${n})`,
        `SELECT ${c} FROM ${c} WHERE ${c} IN (SELECT ${c} FROM ${c} WHERE ${c} IN (SELECT ${c} FROM ${c} WHERE ${c} IN (SELECT ${c} FROM ${c} WHERE ${c} IN (SELECT ${c} FROM ${c} WHERE ${c} IN (${n})))))`,
        `SELECT ${c} FROM ${c} UNION SELECT ${c} FROM ${c}`,
        `SELECT ${c} FROM ${c} JOIN ${c} ON ${c}`,
      ],
      queryObj: null,
      queryComponent: null,
      setNestedAST: null,
      error: null,
    };
  },
  methods: {
    onModelClick(model) {
      try {
        const newQueryObj = parser.astify(parseModelString(model));
        if (this.setNestedAST === null) {
          this.queryObj = newQueryObj;
        } else {
          this.setNestedAST(newQueryObj);
          // this.setNestedAST should have only deep updated queryObj, but we want to trigger
          // a recomputation of this.queryComponent, so we change the queryObj
          // reference to a new object with copied properties
          this.queryObj = Object.assign({}, this.queryObj);
          this.setNestedAST = null;
        }
        this.error = null;
      } catch (err) {
        this.error = {
          type: "parse-error",
          text: "There was a problem parsing model SQL.",
        };
        console.error(err);
      }
    },
  },
  watch: {
    queryObj() {
      this.queryComponent = generateQueryComponent(this.queryObj, this);
      console.log("recomputed queryComponent");
    },
  },
  render(h) {
    const keywordButtons = this.models.map((model) => (
      <KeywordButton
        key={model}
        keyword={model}
        click={() => {
          this.onModelClick(model);
        }}
      />
    ));

    const query = this.error
      ? this.error.text
      : this.queryComponent
      ? this.queryComponent(h)
      : "No Query. Please select a model from above.";

    return (
      <div id="queryBuilder">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "10px",
          }}
        >
          <el-button
            type="info"
            on-click={() => {
              console.log("queryObj", this.queryObj);
              console.log("setNestedAST", this.setNestedAST);
            }}
            style={{
              marginRight: "5px",
            }}
          >
            Print Data
          </el-button>
          <el-button
            type="info"
            on-click={() => {
              this.setNestedAST = null;
            }}
            style={{
              marginRight: "5px",
            }}
          >
            Clear Selected Input
          </el-button>
          <el-button
            type="info"
            on-click={() => {
              console.log(parser.sqlify(this.queryObj));
            }}
          >
            Print Query
          </el-button>
        </div>

        <div class="keyword-list">{keywordButtons}</div>
        <pre id="query">{query}</pre>
        <DataContainer ref="datacontainer" />
      </div>
    );
  },
  updated: function() {
    // if some input boxes stayed after rendered new model,
    // manually trigger v-on:change function to set stuff to the queryObj
    this.$el.querySelectorAll("#query input").forEach((element) => {
      if (element.value) {
        const event = document.createEvent("HTMLEvents");
        event.initEvent("change", false, true);
        element.dispatchEvent(event);
      }
    });
  },
};
</script>

<style scoped>
#queryBuilder {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.keyword-list {
  display: flex;
  flex-direction: row;
}

#query {
  font-size: 20px;
}

p {
  margin: 15px 0;
}

span,
input {
  margin-right: 10px;
}
</style>
