// store.js
import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      cart: [],
    };
  },
  mutations: {
    addToCart(state, product) {
      state.cart.push(product);
    },
  },
});

export default store;
