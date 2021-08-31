<template>
  <div class="DataCont"></div>
</template>

<script>
export default {
  name: "DataContainer",
  data: function() {
    return {
      dataset: {
        // dictionary with keys corresponding to table, value corresponding to columns of that table
        // test data
        student: ["name", "id", "major"],
        company: ["name", "ceo", "departments"],
        stuff: ["this", "is", "stuff", "from", "a", "huge", "database", "many"],
      },
    };
  },
  methods: {
    getData() {
      // just fetch everything
      return this.dataset;
    },
    getTables() {
      // fetch tablenames, used by FROM
      return Object.keys(this.dataset);
    },
    getArrayOfCol(table_name) {
      // Usage: fetch column names, used by SELECT
      // Parameters: table_name = { table: "tablename string", as: "alias, can be null" }
      if (!Array.isArray(table_name) || !table_name.length) {
        return [];
      } else {
        // for each table, fetch its column names, then return [tablename.columnname]
        var return_arr = [];
        for (const { table, as } of table_name) {
          const columns = this.dataset[table];
          if (columns) {
            var modifiedColumns = [...columns];
            modifiedColumns.forEach(function(part, index, arr) {
              // arr = modifiedColumn
              // for each object, add its tablename(or alias) to prefix
              arr[index] = (as ? as : table) + "." + part;
            });
            return_arr = [...return_arr, ...modifiedColumns];
          }
        }
        return return_arr;
      }
    },
    test() {
      console.log("this is a data container");
    },
  },
  mounted() {
    // this.data = this.$api.get_datasource_tablesCols TODO: write this in flok
  },
};
</script>
