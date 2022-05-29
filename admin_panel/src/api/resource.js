import request from '../utils/request';
import store from '../store/store';

/**
 * Simple RESTful resource class
 */
class Resource {
    constructor(uri) {
        this.uri = uri;
    }

    list(query) {
        return request({
            url: `/${this.uri}s`,
            method: 'post',
            params: query,
        })
    }

    delete(id) {
        return request({
            url: `submissions/submission/delete/${id}`,
            method: 'post'
        })
    }

    get(id) {
        return request({
            url: '/' + this.uri + '/details/' + id,
            method: 'get',
        });
    }

    store(resource) {
        return request({
            url: '/' + this.uri + '/add',
            method: 'post',
            data: resource,
            onUploadProgress: function(progressEvent) {
                store.commit('SET_UPLOAD_PROGRESS', parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100)))
              }.bind(store),
        });
    }

    update(id, resource) {
        return request({
            url: '/' + this.uri + '/' + id,
            method: 'post',
            data: resource,
            onUploadProgress: function(progressEvent) {
                store.commit('SET_UPLOAD_PROGRESS', parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100)))
              }.bind(store),
        });
    }

    destroy(id) {
        return request({
            url: '/' + this.uri + '/' + id,
            method: 'delete',
        });
    }
}

export {Resource as default};
