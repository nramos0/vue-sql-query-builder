<template>
  <div class="dropdown">
    <input
      v-model="textInput"
      class="input"
      autocomplete="off"
      v-on:input="filterSuggestion"
      v-on:focus="
        filterSuggestion();
        show = true;
      "
      v-on:blur="show = false"
    />
    <div class="filtered" v-if="filteredSuggest && show">
      <ul>
        <li
          v-for="fSuggest in filteredSuggest"
          v-bind:key="fSuggest.id"
          v-on:mousedown="setInput(fSuggest)"
        >
          {{ fSuggest }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dropdown",
  data: function() {
    return {
      suggestion: ["this", "is", "the", "mex", "pow", "down"],
      filteredSuggest: [],
      textInput: "",
      show: false,
    };
  },
  methods: {
    filterSuggestion() {
      this.filteredSuggest = this.suggestion.filter((el) => {
        return el.toLowerCase().startsWith(this.textInput.toLowerCase());
      });
    },
    setInput(text) {
      console.log(text);
      this.textInput = text;
    },
  },
  mounted() {
    this.filterSuggestion();
  },
};
</script>

<style scoped>
.dropdown {
  width: 150px;
  display: flex;
  flex-direction: column;
}
.dropdown input {
  position: relative;
  width: 100%;
}

.dropdown ul {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
}

.dropdown li {
  position: relative;
  list-style-type: none;
  cursor: pointer;
  background: rgba(100, 100, 100, 0.1);
  width: 100%;
}
</style>
