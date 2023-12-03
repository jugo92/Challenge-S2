const API_URL_BASE = 'http://localhost:3000/api/';

export const apiService = {
    getAll(instance) {
        return fetch(API_URL_BASE + instance)
            .then(response => response.json());
    },

    getOne(instance, id) {
        return fetch(API_URL_BASE + instance + '/' + id)
            .then(response => response.json());
    },

    create(instance, item) {
        var myInit = {
            method: 'POST', 
          };
        if(item instanceof FormData){
            myInit.body = item
        }else {
            myInit.body = JSON.stringify(item);
            myInit.headers = new Headers({
              'Content-Type': 'application/json'
            });
          }
        return fetch(API_URL_BASE + instance, myInit).then(response => response.json())
    },

    update(instance, item, id) {
        var myInit = {
            method: 'PUT', 
          };
        if(item instanceof FormData){
            myInit.body = item
        }else {
            myInit.body = JSON.stringify(item);
            myInit.headers = new Headers({
              'Content-Type': 'application/json'
            });
          }
        return fetch(API_URL_BASE + instance + '/' + id, myInit).then(response => response.json())
    },

    delete(instance, id) {
        return fetch(API_URL_BASE + instance + '/' + id, {
            method: 'DELETE'
        })
            .then(response => response.json());
    },

};