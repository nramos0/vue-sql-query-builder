<template>
  <div>
    <el-form ref="form" label-width="120px">
      <el-form-item label="SQL 模型名称">
        <el-input v-model="label" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="SELECT 语句">
        <el-switch v-model="needSelect"></el-switch>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { constants } from "../config/constants";

export default {
  name: "CreateModel",
  props: {
    models: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      /* 最后发送到 parent 的数据 */
      label: "",
      model: "",

      /* 添加需要的临时数据 */
      needSelect: false,
    };
  },
  methods: {
    onSubmit() {
      // 占位符
      const {
        COL_REF: c,
        NUM: n,
        STR: s,
        BOOL: b,
      } = constants.QUERY_MODEL.DISPLAY_PLACEHOLDER;

      // TODO: 汇总所有的临时变量到 sql 语句模型 this.model
      this.model = "";

      //举例 w/ SELECT
      if (this.needSelect) {
        this.model += `SELECT ${c}`;
      }

      // 完成后发送到 parent
      this.sendModel();
    },
    sendModel() {
      // Use this function to send model to parent
      this.$emit("addModel", { name: this.label, value: this.model });
    },
    close() {
      // Use this function to close messagebox
      this.$emit("closeForm");
    },
  },
};
</script>

<style scoped></style>
