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
    setRecapData(state, recapData) {
     const formatedCart = recapData.cart.map(item => ({
      Nom: item.name,
      Prix: item.price,
      Etat: item.state,
      description: item.description,
       
     }))
      state.recapData = {
        ...recapData,
        cart: formatedCart,
      }
    },
    setSelectedState(state, newState) {
      state.recapData.selectedState = newState;
    }
    ,

    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
      sessionStorage.setItem('token', token);
    },
    clearToken(state) {
      state.token = null;
    },
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    clearUser(state) {
      state.user = null;
      localStorage.removeItem('user');
    },

    setIsloggedIn(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },

    clearIsloggedIn(state) {
      state.isLoggedIn = false;
    },

    setSelectedState(state, newState) {
      state.selectedState = newState;
    },

    setSelectedPrice(state, newPrice) {
      state.selectedPrice = newPrice;
    },

    setselectedName(state, newBrand) {
      state.selectedName = newBrand;
    },

    
  },

  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
  
        if (!response.ok) {
          throw new Error('Login failed');
        }
  
        const user = await response.json();
        commit('setToken', user.token);
        commit('setUser', user);
        commit('setIsloggedIn', true)
        localStorage.setItem('token', user);

        
        return user;
        
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  
    async register({ commit }, userData) {
      try {
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
  
        if (!response.ok) {
          throw new Error('Registration failed');
        }
  
        const user = await response.json();
        commit('setToken', user.token);

        localStorage.setItem('token', user.token);
  
        return user;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  
    logout({ commit }) {
      commit('clearToken');
      commit('clearUser');
      commit('setIsloggedIn', false)
      localStorage.removeItem('token');
    },

    async deleteUser({ commit }) {
      try {
        const response = await fetch('http://localhost:3000/api/users/${state.user.id}', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Delete failed');
        }
  
        commit('clearToken');
        localStorage.removeItem('token');
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async updateUser({ commit }, userData) {
      try {
        const response = await fetch('http://localhost:3000/api/users/${state.user.id}', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(userData),
        });
  
        if (!response.ok) {
          throw new Error('Update failed');
        }
      const updateUser = await response.json();
      commit('setUser', updateUser);
  
        return updateUser;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },

  getters: {
    filteredProducts: (state) => {
      return state.posts.filter((product) => {
        return (
          (state.selectedState === null || product.state === state.selectedState) &&
          (state.selectedPrice === null || product.price === state.selectedPrice) &&
          (state.selectedName === null || product.name === state.selectedName)
        );
      });
    },
  }
  

});

export default store;
