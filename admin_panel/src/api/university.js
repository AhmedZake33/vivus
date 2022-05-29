import Resource from '../api/resource';
import request from "../utils/request";

class University extends Resource {
    constructor() {
        super('universitie');
    }

    list(query) {
        return request({
            url: `/universities`,
            method: 'post',
            params:query
        })
    }

    get(id) {
        return request({
            url: `/university/${id}`,
            method: 'post',
        });
    }

    listOrganizations(university , query){
        return request({
            url: `/organizations/${university}`,
            method: 'post',
            params: query,
        });
    }

}

export {University as default};
