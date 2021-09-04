<template>
  <div>
    <el-dialog
      title="聚合与过滤"
      :visible="visible"
      :editCol_show="editCol_show"
      @close="onClose()"
      append-to-body
      center
    >
      <el-form>
        <div class="moreCols">
          <div
            class="moreColsIn"
            v-for="(item, index) in colForm.moreColObject"
            :key="index"
          >
            <el-form-item label="聚合函数" :label-width="formLabelWidth">
              <el-select
                v-model="item.aggregate"
                placeholder="请选择聚合函数"
                style="display: block"
              >
                <el-option label="NONE" value="none"></el-option>
                <el-option label="COUNT" value="count"></el-option>
                <el-option label="SUM" value="sum"></el-option>
                <el-option label="AVG" value="avg"></el-option>
                <el-option label="MAX" value="max"></el-option>
                <el-option label="MIN" value="min"></el-option>
                <el-option label="COUNT_BIG" value="count_big"></el-option>
                <el-option label="GROUPING" value="grouping"></el-option>
                <el-option label="VAR" value="var"></el-option>
                <el-option label="STDEV" value="stdev"></el-option>
                <el-option label="VARP" value="varp"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否过滤" :label-width="formLabelWidth">
              <el-select
                v-model="item.is_distinct"
                placeholder="请选择是否过滤"
                style="display: block"
              >
                <el-option label="ALL" value="all"></el-option>
                <el-option label="DISTINCT" value="distinct"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="列名" :label-width="formLabelWidth">
              <el-input v-model="item.col" autocomplete="off"></el-input>
            </el-form-item>
            <el-button
              plain
              icon="el-icon-delete"
              type="danger"
              style="display:block;margin:0 auto"
              @click="deleteCol(item, index)"
              >删除</el-button
            >
            <br />
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit()">确 定</el-button>
        <el-button @click="onClose()">取 消</el-button>
        <el-button icon="el-icon-circle-plus" type="primary" @click="addCol()"
          >添加新列名</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EditCol",
  props: {
    editCol_show: {
      type: Boolean,
      default: false,
    },
    rowData_test: {
      type: Object,
      default: null,
    },
    column: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        aggregate: "", // 聚合函数
        is_distinct: "", // 是否过滤
        col: "", // 列名
      },
      visible: this.editCol_show,
      formLabelWidth: "100px",
      colForm: {
        moreColObject: [
          {
            aggregate: "", // 聚合函数
            is_distinct: "", // 是否过滤
            col: "", // 列名
          },
        ],
      },
    };
  },
  methods: {
    onClose() {
      this.$emit("update:editCol_show", false);
    },
    submit() {
      this.$emit("update:editCol_show", false);

      var colname = "";
      for (let i = 0; i <= this.colForm.moreColObject.length - 1; i++) {
        if (this.colForm.moreColObject[i].is_distinct == "all") {
          if (this.colForm.moreColObject[i].aggregate == "none") {
            colname = colname + this.colForm.moreColObject[i].col;
          } else {
            colname =
              colname +
              this.colForm.moreColObject[i].aggregate +
              "(" +
              this.colForm.moreColObject[i].col +
              ")";
          }
        } else {
          if (this.colForm.moreColObject[i].aggregate == "none") {
            colname = colname + "DISTINCT " + this.colForm.moreColObject[i].col;
          } else {
            colname =
              colname +
              this.colForm.moreColObject[i].aggregate +
              "(" +
              "DISTINCT " +
              this.colForm.moreColObject[i].col +
              ")";
          }
        }
        colname = colname + ",";
      }
      colname = colname.substring(0, colname.lastIndexOf(","));
      this.$emit("update:column", colname);
    },
    addCol() {
      this.colForm.moreColObject.push({
        aggregate: "",
        is_distinct: "",
        col: "",
      });
    },
    deleteCol(item, index) {
      this.colForm.moreColObject.splice(index, 1);
    },
  },
  watch: {
    editCol_show(newVal) {
      this.visible = newVal;
    },
  },
};
</script>

<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  background: white;
  overflow: hidden;
  overflow-y: auto;
}
</style>
