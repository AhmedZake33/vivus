import Resource from '../api/resource';
import request from "../utils/request";

class Recovery extends Resource {
    constructor() {
        super('recoveries');
    }

    list(query) {
        return request({
            url: `/recoveries`,
            method: 'post',
            params: query,
        });
    }

}

export {Recovery as default};
