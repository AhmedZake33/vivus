import Resource from '../api/resource';
import request from "../utils/request";

class Logs extends Resource {
    constructor() {
        super('log');
    }



    get(id) {
        return request({
            url: '/logs/' + id,
            method: 'get',
        });
    }

}

export {Logs as default};
