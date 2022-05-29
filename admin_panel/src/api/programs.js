import Resource from '../api/resource';
import request from "../utils/request";

class Programs extends Resource {
    constructor() {
        super('program');
    }



    get(id) {
        return request({
            url: `/program/${id}`,
            method: 'post',
        });
    }
}

export {Programs as default};
