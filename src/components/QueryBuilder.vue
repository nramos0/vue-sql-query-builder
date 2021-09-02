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
      showCreateModel: false,
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
      <el-tab-pane key={model} label="Label">
        {model}
      </el-tab-pane>
    ));

    const query = this.error
      ? this.error.text
      : this.queryComponent
      ? this.queryComponent(h)
      : "No Query. Please select a model from above.";

    const tabs = h(
      "el-tabs",
      {
        props: { type: "border-card" },
        on: {
          "tab-click": (tab, event) => {
            this.onModelClick(tab.$vnode.key);
          },
        },
      },
      keywordButtons
    );

    const createNewModel = h(
      "el-dialog",
      {
        props: {
          visible: this.showCreateModel,
        },
        on: {
          "update:visible": (event) => {
            this.showCreateModel = event;
          },
        },
      },
      [<div>在这里添加东西</div>]
    );

    const onClickButton = h(
      "el-button",
      {
        attrs: {
          style: "width: 100%;",
        },
        props: {
          type: "primary",
        },
        on: {
          click: () => {
            this.showCreateModel = true;
          },
        },
      },
      ["创建新模板"]
    );

    return (
      <el-container
        id="queryBuilder"
        style="postion:absolue;width:100%;height:100%"
      >
        <el-header style="height:20%">{tabs}</el-header>
        <el-main>
          <el-card id="query">{query}</el-card>
        </el-main>
        <el-footer style="position:fixed; bottom: 0;left: 0;right: 0;">
          {onClickButton}
        </el-footer>
        {createNewModel}
        <DataContainer ref="datacontainer" />
      </el-container>
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
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.keyword-list {
  display: flex;
  flex-direction: row;
}

#query {
  font-size: 20px;
  line-height: 250%;
}

p {
  margin: 0;
}

span,
input {
  margin-right: 10px;
}
</style>
