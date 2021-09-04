import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vuex from "vuex";

Vue.use(Vuex);
Vue.use(ElementUI);

Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    datacontainer: null,
  },
  mutations: {
    setContainer: (state, container) => {
      state.datacontainer = container;
    },
  },
  getters: {
    datacontainer: (state) => {
      return state.datacontainer;
    },
  },
});

new Vue({
  render: (h) => h(App),
  store: store,
}).$mount("#app");
