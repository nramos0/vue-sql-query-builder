<template>
  <div class="dropdown" v-on:focus="console.log('fuck')">
    <input
      v-model="textInput"
      class="input"
      autocomplete="off"
      v-on:input="filterSuggestion"
      v-on:focus="onFocus"
      v-on:change="onChange"
      v-on:blur="onBlur"
    />
    <div class="filtered" v-if="filteredSuggest && show">
      <ul>
        <li
          v-for="filtSuggest in filteredSuggest"
          v-bind:key="filtSuggest.id"
          v-on:mousedown="setInput(filtSuggest)"
        >
          {{ filtSuggest }}
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
      // filteredSuggest is suggestion filtered according to textInput
      filteredSuggest: [],
      textInput: "",
      show: false,
    };
  },
  props: {
    // Trying to accomidate the onchange, onblur, and onfocus
    // as name suggests, will run in onChange, onFocus and onBlur
    propOnChange: Function,
    propOnFocus: Function,
    propOnBlur: Function,
  },
  methods: {
    filterSuggestion() {
      this.filteredSuggest = this.suggestion.filter((el) => {
        return el.toLowerCase().startsWith(this.textInput.toLowerCase());
      });
    },
    setInput(text) {
      // used when selected a dropdown option, used mousedown cause mousedown comes before blur
      this.textInput = text;
      // onChange doesnt run when the change is not done by user
      this.onChange();
    },
    onFocus() {
      this.filterSuggestion();
      this.show = true;
      if (this.propOnFocus) {
        this.propOnFocus(this);
      }
    },
    onChange() {
      if (this.propOnChange) {
        this.propOnChange(this);
      }
    },
    onBlur() {
      this.show = false;
      if (this.propOnBlur) {
        this.propOnBlur(this);
      }
    },
    setSuggestions(newSuggestions) {
      this.suggestion = newSuggestions;
      this.filterSuggestion();
    },
    test() {
      console.log("ran test");
    },
  },
  mounted() {
    this.filterSuggestion();
  },
  computed: {
    target: function() {
      // temporary fix to accomidate e.target.value for inputbox
      // will delete in future
      return {
        value: this.textInput,
      };
    },
  },
};
</script>

<style scoped>
/* Prettify stuff, probably will change */

.dropdown {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* Positioning */

.dropdown {
  position: relative;
  width: 150px;
  height: 20px;
  margin: 0 10px;
  padding: 0;
  display: inline-block;
}

input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.filtered {
  position: absolute;
  width: 100%;
  height: 10px;
  top: 110%;
  left: 0;
  z-index: 1;
  overflow: visible;
}

ul {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0;
}

li {
  position: relative;
  list-style-type: none;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  background: rgba(200, 200, 200);
}
</style>
