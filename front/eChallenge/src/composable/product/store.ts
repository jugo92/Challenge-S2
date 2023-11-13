import { StoreOptions, createStore } from "vuex/types/index.js";


interface User {
  id: number;
  name: string;
  role: string;
}

interface State {
  userlist: User[];
}

const storeOptions: StoreOptions<State> = {
  state: {
    userlist: [
      { id: 1, name: 'Brad', role: 'admin' },
      { id: 2, name: 'John', role: 'user' },
      { id: 3, name: 'Jessy', role: 'user' },
      { id: 4, name: 'Jill', role: 'admin' },
      { id: 5, name: 'Jack', role: 'user' },
    ],
  },
  
  getters: {
    userlist: (state: State) => {
      return state.userlist;
    },
    
    user: (state: State) => (id: number) => {
      return state.userlist.find(user => user.id === id);
    },
  },
};

const store = createStore(storeOptions);

export default store;
