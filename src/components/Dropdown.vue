<template>
  <div class="dropdown">
    <el-autocomplete
      class="input"
      v-model="textInput"
      :fetch-suggestions="querySearch"
      v-on:focus="onFocus"
      v-on:change="onChange"
      v-on:blur="onBlur"
      v-on:select="onChange"
    >
      <template slot-scope="props">
        <el-tooltip
          class="item"
          effect="dark"
          :content="props.item.show"
          placement="right"
          :disabled="!(props.item.show.length > 15)"
        >
          <div class="show">{{ props.item.show }}</div>
        </el-tooltip>
      </template>
    </el-autocomplete>
  </div>
</template>

<script>
export default {
  name: "Dropdown",
  data: function() {
    return {
      suggestion: [],
      textInput: "",
      show: false,

      // to check inputType (see props)
      availableInputs: {
        select: "select",
        from: "from",
        join: "join",
        on: "on",
      },
    };
  },
  props: {
    // Trying to accomidate the onchange, onblur, and onfocus
    // as name suggests, will run in onChange, onFocus and onBlur
    propOnChange: Function,
    propOnFocus: Function,
    propOnBlur: Function,

    // given inputType try to make "intelligent" suggestions for specific input
    // currently not requred,
    inputType: {
      type: String,
      default: "",
      requrie: false,
    },
  },
  methods: {
    onFocus() {
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
    },

    /* Some Useful Tools */

    filteredSuggest(text) {
      // filteredSuggest is data.suggestion filtered according to text (prefix must match)
      return this.suggestion.filter((el) => {
        return el.toLowerCase().startsWith(text.toLowerCase());
      });
    },

    filteredSuggestObj(text) {
      return this.filteredSuggest(text).map((el) => {
        return {
          value: el,
          show: el,
        };
      });
    },

    splitBy_As_Comma(text) {
      // Turns text into array
      // eg. 'left AS right, daikon' turns into ['left', ' AS ', 'right', ',', ' daikon']
      const check_As_Comma = /(\sAS\s|,)/gi;
      return text.split(check_As_Comma);
    },

    checkIfEmpty(text) {
      // checks if is empty or equal to all white spaces
      const isEmpty = /^\s*$/;
      return isEmpty.test(text);
    },

    /* Compute Suggestions */

    select_from_Compute_Suggestion(text) {
      const filteredSuggestObj = this.filteredSuggestObj(text.trim());

      const splitBy_As_Comma = this.splitBy_As_Comma(text);
      // separate out AS + , in text

      if (splitBy_As_Comma.length > 2 && splitBy_As_Comma.at(-2) === ",") {
        // check if input is a new entry select/from (with comma)
        // if so recursively call itself and append its result
        // example. "a AS b, c AS d, e" isolates "e" and recursively calls on select_from_Compute_Suggestion("e")
        const newFilter = this.select_from_Compute_Suggestion(
          splitBy_As_Comma.at(-1).trim()
        );

        splitBy_As_Comma.pop();
        splitBy_As_Comma.push(" ");
        const newInput = splitBy_As_Comma.join("");
        return newFilter.map((el) => {
          return {
            value: newInput + el.value,
            show: el.value,
          };
        });
      }

      /* Recursive calls finished, no longer have commas (no more "a AS b, c" only "c") */

      if (
        splitBy_As_Comma.length > 2 &&
        splitBy_As_Comma.at(-2).toLowerCase() === " as " &&
        !this.checkIfEmpty(splitBy_As_Comma.at(-1))
      ) {
        // check if text is of the form "a AS b"
        // if so, append ", " to it, corresponds to when user finished typing alias
        return [
          {
            value: text + ", ",
            show: splitBy_As_Comma.at(-1) + ", ",
          },
        ];
      }

      const equalsIndex = this.suggestion.indexOf(text);
      if (equalsIndex >= 0) {
        // if user has input exactly equal to one of the suggestions
        // then user is going to add , or AS to the statement
        const addAs = this.suggestion[equalsIndex] + " AS ";
        const addComma = this.suggestion[equalsIndex] + ", ";

        // show the elements that are not equal to it (has text as prefix)
        return [
          { value: addAs, show: addAs },
          { value: addComma, show: addComma },
          ...filteredSuggestObj.filter((el) => el.value !== text),
        ];
      }

      return filteredSuggestObj;
    },

    join_ComputeSuggestion(text) {
      const filteredSuggestObj = this.filteredSuggestObj(text.trim());

      const splitBy_As_Comma = this.splitBy_As_Comma(text);

      if (
        splitBy_As_Comma.length > 2 &&
        splitBy_As_Comma.at(-2).toLowerCase() === " as " &&
        !this.checkIfEmpty(splitBy_As_Comma.at(-1))
      ) {
        // check if text is of the form "a AS b"
        // if so, append ", " to it, corresponds to when user finished typing alias
        return [
          {
            value: text,
            show: splitBy_As_Comma.at(-1),
          },
        ];
      }

      const equalsIndex = this.suggestion.indexOf(text);
      if (equalsIndex >= 0) {
        // if user has input exactly equal to one of the suggestions
        // then user is going to add , or AS to the statement
        const addAs = this.suggestion[equalsIndex] + " AS ";

        // show the elements that are not equal to it (has text as prefix)
        return [
          { value: addAs, show: addAs },
          ...filteredSuggestObj.filter((el) => el.value !== text),
        ];
      }
      return filteredSuggestObj;
    },

    on_ComputeSuggestion(text) {
      const filteredSuggestObj = this.filteredSuggestObj(text.trim());

      const check_OP = /(!=|=)/gi;
      const splitByOP = text.split(check_OP);

      if (splitByOP.length > 2 && check_OP.test(splitByOP.at(-2))) {
        // check if input needs a new column after = or !=
        const newFilter = this.filteredSuggestObj(splitByOP.at(-1).trim());

        splitByOP.pop();
        splitByOP.push(" ");
        const newInput = splitByOP.join("");
        return newFilter.map((el) => {
          return {
            value: newInput + el.value,
            show: el.value,
          };
        });
      }

      const equalsIndex = this.suggestion.indexOf(text);
      if (equalsIndex >= 0) {
        // if user has input exactly equal to one of the suggestions
        // then user is going to add , or AS to the statement
        const appendEquals = this.suggestion[equalsIndex] + " = ";
        const appendNEquals = this.suggestion[equalsIndex] + " != ";

        // show the elements that are not equal to it (has text as prefix)
        return [
          { value: appendEquals, show: appendEquals },
          { value: appendNEquals, show: appendNEquals },
          ...filteredSuggestObj.filter((el) => el.value !== text),
        ];
      }
      return filteredSuggestObj;
    },

    querySearch(text, cb) {
      // transfer data to element-ui's style
      cb(this.computedSuggest);
    },
  },
  computed: {
    computedSuggest() {
      // computed suggest *tries* to make suggestions "intelligent"
      // *BEWARE* lots of hard coded stuff to make the input box more intellgent than it seems
      // may be hard to read

      // return value should be array of objects
      // each object should have keys {value: , show: }, value is the value that the input box changes to
      // show is the thing to show to user, usually value is way too long to display

      const check = this.availableInputs;
      if (this.inputType === check.select || this.inputType === check.from) {
        return this.select_from_Compute_Suggestion(this.textInput);
      } else if (this.inputType === check.join) {
        return this.join_ComputeSuggestion(this.textInput);
      } else if (this.inputType === check.on) {
        return this.on_ComputeSuggestion(this.textInput);
      }

      // inputType is not set
      const filteredSuggest = this.filteredSuggest(this.textInput.trim());
      console.log(`InputType = ${this.inputType} is not set or not known`);
      return filteredSuggest.map((el) => {
        return {
          value: el,
          show: el,
        };
      });
    },

    target: function() {
      // temporary fix to accomidate e.target.value for inputbox
      // will delete in future
      console.error("Changed e.target.value to e.textInput");
      return {
        value: this.textInput,
      };
    },
  },

  mounted() {
    // check if input type is supported
    this.inputType = this.inputType.toLowerCase();
    if (this.inputType) {
      if (Object.values(this.availableInputs).indexOf(this.inputType) == -1) {
        console.error(
          `Gave inputType ${this.inputType} but input type is not known in`,
          this.availableInputs
        );
      }
    } else {
      console.warn("Dropdown Input type is not set for", this, this.$el);
    }
  },
};
</script>

<style scoped>
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
</style>
