const API_URL_BASE = import.meta.env.VITE_API_URL;

export const apiService = {
    getAll(instance, params) {
      console.log("test")
        let url = API_URL_BASE + "/" + instance;
        console.log("url : ", url)
        if (params) {
            url += '?' + params;
        }
        return fetch(url)
            .then(response => response.json());
    },

    getOne(instance, id) {
        return fetch(API_URL_BASE + "/" + instance + '/' + id)
            .then(response => response.json());
    },

    create(instance, item) {
        var myInit = {
            method: 'POST', 
          } as any;
        if(item instanceof FormData){
            myInit.body = item
        }else {
            myInit.body = JSON.stringify(item);
            myInit.headers = new Headers({
              'Content-Type': 'application/json'
            });
          }
        return fetch(API_URL_BASE + "/" + instance, myInit).then(response => response.json())
    },

    update(instance, item, id) {
        var myInit = {
            method: 'PUT', 
          } as any;
        if(item instanceof FormData){
            myInit.body = item
        }else {
            myInit.body = JSON.stringify(item);
            myInit.headers = new Headers({
              'Content-Type': 'application/json'
            });
          }
        return fetch(API_URL_BASE + "/" + instance + '/' + id, myInit).then(response => response.json())
    },

    delete(instance, id) {
        return fetch(API_URL_BASE + "/" + instance + '/' + id, {
            method: 'DELETE'
        })
    },

};