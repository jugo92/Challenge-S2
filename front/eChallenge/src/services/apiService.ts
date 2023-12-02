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
        return fetch(API_URL_BASE + instance, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
            .then(response => response.json());
    },

    update(instance, item, id) {
        return fetch(API_URL_BASE + instance + '/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
            .then(response => response.json());
    },

    delete(instance, id) {
        return fetch(API_URL_BASE + instance + '/' + id, {
            method: 'DELETE'
        })
            .then(response => response.json());
    },

};