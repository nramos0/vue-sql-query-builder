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
        <div class="show">{{ props.item.show }}</div>
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

    filteredSuggest(text) {
      // filteredSuggest is data.suggestion filtered according to text (prefix must match)
      return this.suggestion.filter((el) => {
        return el.toLowerCase().startsWith(text.toLowerCase());
      });
    },

    select_from_Compute_Suggestion(text) {
      const filteredSuggest = this.filteredSuggest(text.trim());

      const check_As_Comma = /(\sAS\s|,)/gi;
      const splitBy_As_Comma = text.split(check_As_Comma);
      // separate out AS + , in text
      const isEmpty = /^\s*$/;
      // checks if is empty or equal to all white spaces

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
        !isEmpty.test(splitBy_As_Comma.at(-1))
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

      const filteredSuggestObj = filteredSuggest.map((el) => {
        return {
          value: el,
          show: el,
        };
      });
      const equalsIndex = this.suggestion.indexOf(text);
      if (equalsIndex >= 0) {
        // if user has input exactly equal to one of the suggestions
        // then user is going to add , or AS to the statement
        const addAs = this.suggestion[equalsIndex] + " AS ";
        const addComma = this.suggestion[equalsIndex] + ", ";

        if (this.filteredSuggest.length === 1) {
          // if filter length === 1 then user has only 1 choice
          // otherwise it may have been a false positive since user acually wanted sth with same prefix
          return [
            { value: addAs, show: addAs },
            { value: addComma, show: addComma },
          ];
        } else {
          return [
            { value: addAs, show: addAs },
            { value: addComma, show: addComma },
            ...filteredSuggestObj,
          ];
        }
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
