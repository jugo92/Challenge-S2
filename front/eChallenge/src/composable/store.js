import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      cart: JSON.parse(localStorage.getItem("cart")) || [],
      searchTerm: "",
      searchHistory: [],
      recapData: null,
      token: localStorage.getItem("token") || null,
      isLoggedIn: false,
      user: JSON.parse(localStorage.getItem("user")) || null,
      selectedCategory: null,
      products: [],
      productNotifications: {},
      filteredProperties: {
        Stockage: [],
        Taille: [],
        Systeme: [],
        Processeur: [],
        gpu: [],
        state: [],
        price: [],
        Marque: [],
        Category: [],
      },
      orders: JSON.parse(localStorage.getItem('orders')) || [],
      reimburseProduct: [],
      notifications: [],
      usernotifications: [],
    };
  },
  getters: {
    selectedState: state => state.selectedState,
    triSelected: state => state.triSelected,
    filterPost: state => state.filterPost,
    uniqueStates: state => {
      const states = new Set(state.posts.map(post => post.state));
      return Array.from(states);
    },
  },
  mutations: {
    addToCart(state, product) {
      state.cart.push(product);
      updateProductExpiration(product);
    },
    removeFromCart(state, product) {
      const index = state.cart.findIndex(p => p.id === product.id);
      if (index !== -1) {
        state.cart.splice(index, 1);
        localStorage.removeItem(`product_${product.id}_expiration`);
      }
    },
    setSearchTerm(state, searchTerm) {
      state.searchTerm = searchTerm;
      state.searchHistory.unshift(searchTerm);
    },
    clearSearchHistory(state) {
      state.searchHistory = [];
    },
    setRecapData(state, recapData) {
      const formatedCart = recapData.cart.map(item => ({
        Nom: item.name,
        Prix: item.price,
        Etat: item.state,
        description: item.description,
      }));
      state.recapData = {
        ...recapData,
        cart: formatedCart,
      };
    },
    setSelectedState(state, newState) {
      state.recapData.selectedState = newState;
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
      sessionStorage.setItem("token", token);
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    },
    setUser(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    clearUser(state) {
      state.user = null;
      localStorage.removeItem("user");
    },

    setIsloggedIn(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },

    clearIsloggedIn(state) {
      state.isLoggedIn = false;
    },

    setselectedName(state, newBrand) {
      state.selectedName = newBrand;
    },

    setSelectedCategory(state, category) {
      state.selectedCategory = category;
    },

    setProductDetails(state, productDetails) {
      state.post = productDetails.product;
      state.selectedCategory = productDetails.category;
      const productIndex = state.products.findIndex(
        p => p._id === productDetails.product._id
      );
      if (productIndex !== -1) {
        state.products[productIndex].receiveNotifications =
          productDetails.product.receiveNotifications;
      }
    },

    setProductNotification(state, { productId, receiveNotifications }) {
      if (state.productNotifications[productId]) {
        state.productNotifications[productId].receiveNotifications =
          receiveNotifications;
      } else {
        state.productNotifications[productId] = { receiveNotifications };
      }
    },

    setProducts(state, products) {
      state.products = products;
    },

    setFilteredProperties(state, products) {
      state.filteredProperties = {
        Stockage: Array.from(new Set(products.map(product => product.storage))),
        Taille: Array.from(new Set(products.map(product => product.size))),
        Systeme: Array.from(
          new Set(products.map(product => product.operatingSystem))
        ),
        cpu: Array.from(new Set(products.map(product => product.cpu))),
        gpu: Array.from(new Set(products.map(product => product.gpu))),
        state: Array.from(new Set(products.map(product => product.state))),
        price: Array.from(new Set(products.map(product => product.price))),
        Marque: Array.from(
          new Set(products.map(product => product.Marque.name))
        ),
        Category: Array.from(
          new Set(products.map(product => product.Category.name))
        ),
      };
    },

    setSelectedState(state, selectedState) {
      state.selectedState = selectedState;
    },
    setTriSelected(state, triSelected) {
      state.triSelected = triSelected;
    },
    setFilterPost(state, filterPost) {
      state.filterPost = filterPost;
    },

    setOrders(state, orders) {
      state.orders = orders;
   },

   updateOrders(state, orders) {
    state.orders = orders;
    localStorage.setItem('orders', JSON.stringify(orders));
  },

    setReimburdeProduct(state, reimburseProduct) {
      state.reimburseProduct = reimburseProduct;
    },

    setNotifications(state, notifications) {
      state.notifications = notifications;
      console.log("State updated with notifications:", state.notifications);
    } ,

    setNotificationUserRelation(state, { notificationId, isChecked, userId, newRelation }) {
      const existingRelationIndex = state.usernotifications.findIndex(relation => relation.notificationId === notificationId && relation.userId === userId);
  
      if (existingRelationIndex !== -1) {
        state.usernotifications[existingRelationIndex].isChecked = isChecked;
      } else {
        state.usernotifications.push({ notificationId, isChecked, userId, ...newRelation });
      }
    },
  },
      

  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
    
        if (!response.ok) {
          const errorDetails = await response.json();
          console.error("Login failed. Server response:", response);
          console.error("Error details:", errorDetails);
          throw new Error("Login failed");
        }
    
        const user = await response.json();
        commit("setToken", user.token);
        commit("setUser", user);
        commit("setIsloggedIn", true);
        localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("token", user.token);
    
        return user;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    

    async register({ commit }, userData) {
      try {
        const response = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error("Registration failed");
        }

        const user = await response.json();
        commit("setToken", user.token);

        localStorage.setItem("token", user.token);

        return user;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    logout({ commit }) {
      commit("clearToken");
        commit("clearUser");
        commit("setIsloggedIn", false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
    },

    async deleteUser({ commit }) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/${user._id}",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Delete failed");
        }

        commit("clearToken");
        localStorage.removeItem("token");
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async updateUser({ commit }, userData) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/${user+id}",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(userData),
          }
        );

        if (!response.ok) {
          throw new Error("Update failed");
        }
        const updateUser = await response.json();
        commit("setUser", updateUser);

        return updateUser;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async fetchProductDetails({ commit }, productId) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/products/${productId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }

        const productDetails = await response.json();
        commit("setSelectedCategory", productDetails.Category);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    },


    async fetchProducts({ commit }) {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const products = await response.json();
        commit("setProducts", products);
        commit("setFilteredProperties", products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    
    async fetchOrders({ commit, rootState }) {
      if (rootState.isLoggedIn) {
        try {
          const response = await fetch("http://localhost:3000/api/orders", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${rootState.token}`,
            },
          });
  
          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }
  
          const orders = await response.json();
          commit("setOrders", orders);
          commit("updateOrders", orders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      } else {
        console.warn("User is not logged in");
      }
    },

    async reimburseProduct({ commit }, product) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/products/${product._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ status: 'Refund' }), 
          }
        );
    
        if (!response.ok) {
          throw new Error("Remboursement échoué");
        }
    
        const reimbursedProduct = await response.json();
        console.log("Produit remboursé avec succès", reimbursedProduct);
    
        commit("setReimburdeProduct", reimbursedProduct);
    
        return reimbursedProduct;
      } catch (error) {
        console.error("Erreur lors du remboursement du produit:", error);
        throw error;
      }
    },
    async fetchNotifications({ commit, rootState }) {
      if (rootState.isLoggedIn) {
        try {
          const response = await fetch("http://localhost:3000/api/notifications", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${rootState.token}`,
            },
          });
    
          if (!response.ok) {
            throw new Error("Failed to fetch notifications");
          }
    
          const notifications = await response.json();
          console.log("Notifications:", notifications);
          commit("setNotifications", notifications);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      } else {
        console.warn("User is not logged in");
      }
    },

    // ...

async updateNotificationUserRelation({ commit, state }, { notificationId }) {
  try {
    const response = await fetch('http://localhost:3000/api/notificationsusers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${state.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserId: state.user._id,
        type_id: notificationId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update/create notification-user relation');
    }

    const newRelation = await response.json();

    commit('setNotificationUserRelation', { notificationId, userId: state.user._id, newRelation });
  } catch (error) {
    console.error('Erreur lors de la mise à jour/création de la relation notification-utilisateur :', error);
  }
},

// ...

    
    
  },
});

store.watch(
  state => ({ cart: state.cart, token: state.token }),
  ({ cart, token }) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    if (token) {
      localStorage.setItem("token", token);
    }
  },
  { deep: true }
);

const updateProductExpiration = product => {
  const expirationTime = new Date().getTime() + 15 * 60 * 1000;
  product.expirationTime = expirationTime;
  localStorage.setItem(
    `product_${product.id}_expiration`,
    expirationTime.toString()
  );
};

export default store;
