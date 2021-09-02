<template>
  <div>
    <el-form ref="form" label-width="120px">
      <el-form-item label="SQL 模型名称">
        <el-input v-model="label"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CreateModel",
  data() {
    return {
      /* 最后发送到 parent 的数据 */
      label: "",
      model: "",

      /* 添加需要的临时数据 */
    };
  },
  methods: {
    onSubmit() {
      // TODO: 汇总所有的 temp 变量到 sql 语句模型 this.model
      // ... this,model = "SELECT ... [FROM]" 等等
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
