import Resource from '../api/resource';
import request from "../utils/request";

class Teams extends Resource {
    constructor() {
        super('team');
    }

    get(id) {
        return request({
            url: `/teams/${id}`,
            method: 'get',
        });
    }

}

export {Teams as default};
