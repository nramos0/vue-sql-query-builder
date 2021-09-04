<template>
  <div>
    <el-form ref="form" label-width="120px">
      <!-- 模型放这里 -->
      <el-form-item label="SQL 模型名称">
        <el-input v-model="label" placeholder="名称" />
      </el-form-item>

      <el-form-item label="SELECT 语句">
        <el-row>
          <el-col :span="6">
            <el-switch v-model="needSelect" />
          </el-col>
          <el-col :span="12">
            <el-checkbox v-model="needDistinct" v-if="needSelect"
              >DISTINCT</el-checkbox
            >
          </el-col>
        </el-row>
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
        <el-row>
          <el-col :span="6">
            <el-checkbox v-model="needJoin">JOIN</el-checkbox>
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="needJoinOn" v-if="needJoin">ON</el-checkbox>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="WHERE 语句">
        <el-row>
          <el-col :span="6"
            ><el-checkbox v-model="needWhere">WHERE</el-checkbox></el-col
          >
          <el-col :span="6">
            <el-select
              v-model="whereTemplate"
              v-if="needWhere"
              placeholder="存储模板"
            >
              <el-option key="bool" label="BOOL" value="bool" />
              <el-option key="equal" label="=" value="=" />
              <el-option key="nequal" label="!=" value="!=" />
              <el-option key="less" label="<" value="<" />
              <el-option key="leq" label="<=" value="<=" />
              <el-option key="greater" label=">" value=">" />
              <el-option key="geq" label=">=" value=">=" />
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="条件语句">
        <el-col :span="6"
          ><el-checkbox v-model="needGroupBy">GROUP BY</el-checkbox></el-col
        >
        <el-col :span="6"
          ><el-checkbox v-model="needHaving">HAVING</el-checkbox></el-col
        >
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

      <el-form-item label="ORDER BY语句">
        <el-row>
          <el-col :span="6"
            ><el-checkbox v-model="needOrderBy">ORDER BY</el-checkbox></el-col
          >
          <el-col :span="12">
            <el-select v-model="orderByTemplate" v-if="needOrderBy">
              <el-option key="ASC" label="ASC" value="ASC" />
              <el-option key="DESC" label="DESC" value="DESC" /> </el-select
          ></el-col>
        </el-row>
      </el-form-item>

      <!-- 按钮 -->
      <el-form-item>
        <el-button
          round
          icon="el-icon-edit"
          type="warning"
          @click="handleEdit()"
          >编辑</el-button
        >
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
    <div class="block" style="margin-top:10px">
      <EditCol :editCol_show.sync="editCol_show" :column.sync="columnPreset" />
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { constants } from "../config/constants";
import EditCol from "./CreateModelSubcomponent/EditCol.vue";

export default {
  name: "CreateModel",
  components: {
    EditCol,
  },
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
      preset: "",

      /* 添加需要的临时数据 */
      needSelect: false,
      needDistinct: false,
      needFrom: false,
      fromTemplate: null,
      needJoin: false,
      needJoinOn: false,
      needWhere: false,
      whereTemplate: "bool",
      needGroupBy: false,
      needHaving: false,
      needUnion: false,
      unionWith: null,
      needOrderBy: false,
      orderByTemplate: "ASC",
      editCol_show: false,
      columnPreset: "",
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
        if (this.needDistinct) {
          this.model += `SELECT DISTINCT ${c} `;
        } else {
          this.model += `SELECT ${c} `;
        }
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
      if (this.needWhere) {
        if (this.whereTemplate === "bool") {
          this.model += ` WHERE ${b} `;
        } else {
          this.model += ` WHERE ${c} `;
          this.model += this.whereTemplate;
          this.model += ` ${s} `;
        }
      }
      if (this.needGroupBy) {
        this.model += ` GROUP BY ${c} `;
      }
      if (this.needHaving) {
        this.model += ` HAVING ${b} `;
      }
      if (this.needUnion && this.unionWith) {
        this.model += ` UNION `;
        this.model += this.unionWith;
      }
      if (this.needOrderBy) {
        this.model += ` ORDER BY ${c} `;
        this.model += this.orderByTemplate;
      }

      this.preset = this.columnPreset;

      // 完成后发送到 parent
      this.sendModel();
    },
    sendModel() {
      // Use this function to send model to parent
      this.$emit("addModel", {
        name: this.label ? this.label : "未命名",
        value: this.model,
        preset: this.preset,
      });
    },
    close() {
      // Use this function to close messagebox
      this.$emit("closeForm");
    },
    handleEdit() {
      this.editCol_show = true;
    },
  },
};
</script>
