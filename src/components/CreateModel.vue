<template>
  <div>
    <el-form ref="form" label-width="120px">
      <!-- 模型放这里 -->
      <el-form-item label="SQL 模型名称">
        <el-input v-model="label" placeholder="名称" />
      </el-form-item>

      <el-form-item label="SELECT 语句">
        <el-switch v-model="needSelect" />
      </el-form-item>

      <el-form-item label="FROM 语句">
        <el-row>
          <el-col :span="6"
            ><el-checkbox v-model="needFrom">FROM</el-checkbox></el-col
          >
          <el-col :span="12">
            <el-select
              v-model="fromTemplate"
              v-if="needFrom"
              placeholder="存储模板"
            >
              <el-option :key="-1" label="手动输入" :value="null" />
              <el-option
                v-for="item in models"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              /> </el-select
          ></el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="JOIN 语句">
        <el-checkbox v-model="needJoin">JOIN</el-checkbox>
        <el-checkbox v-model="needJoinOn" v-if="needJoin">ON</el-checkbox>
      </el-form-item>

      <el-form-item label="UNION 语句">
        <el-row>
          <el-col :span="6"
            ><el-checkbox v-model="needUnion">UNION</el-checkbox></el-col
          >
          <el-col :span="12">
            <el-select
              v-model="unionWith"
              v-if="needUnion"
              placeholder="存储模板"
            >
              <el-option
                v-for="item in models"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              >
              </el-option> </el-select
          ></el-col>
        </el-row>
      </el-form-item>

      <!-- 按钮 -->
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
      needFrom: false,
      fromTemplate: null,
      needJoin: false,
      needJoinOn: false,
      needUnion: false,
      unionWith: null,
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
      // 顺序: https://www.postgresql.org/docs/13/sql-select.html
      this.model = "";

      //举例 w/ SELECT
      if (this.needSelect) {
        this.model += `SELECT ${c} `;
      }
      if (this.needFrom) {
        this.model += ` FROM`;
        if (this.fromTemplate) {
          // FROM 存储的 SQL 模型
          this.model += ` ( `;
          this.model += this.fromTemplate;
          this.model += ` )`;
        } else {
          // 手输入模型
          this.model += ` ${c}`;
        }
      }
      if (this.needJoin) {
        this.model += ` JOIN ${c} `;
        this.model += this.needJoinOn ? ` ON ${c}` : "";
      }

      if (this.needUnion && this.unionWith) {
        this.model += ` UNION `;
        this.model += this.unionWith;
      }

      console.log(this.model);

      // 完成后发送到 parent
      this.sendModel();
    },
    sendModel() {
      // Use this function to send model to parent
      this.$emit("addModel", {
        name: this.label ? this.label : "未命名",
        value: this.model,
      });
    },
    close() {
      // Use this function to close messagebox
      this.$emit("closeForm");
    },
  },
};
</script>
